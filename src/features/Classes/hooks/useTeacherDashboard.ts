import { mutationKeys } from "@/shared/constants/mutationKeys";
import { queryKeys } from "@/shared/constants/queryKeys";
import { StaleTime } from "@/shared/constants/tanstackConfig";
import { useHapticAlerts } from "@/shared/hooks/useHapticAlerts";
import { useAuthStore } from "@/shared/stores/authStore";
import { parseEndedTrue, parseLectureId } from "@/shared/utils/parsers";
import { showInternetNotConnected } from "@/shared/utils/toasts";
import { lectureService } from "@classes/services/lectureService";
import { LectureWithCount } from "@classes/types/common";
import {
  generateMockLectures,
  getTeacherDashboardStressOptions,
} from "@classes/utils/stressTest";
import { socketService } from "@shared/services/socketService";
import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { selectionAsync } from "expo-haptics";
import { useNetworkState } from "expo-network";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const DEFAULT_LECTURE_ROW_HEIGHT = 236;
const TEACHER_QUERY_FRESH_MS = StaleTime.SECONDS_30;

type LectureApiItem = Omit<
  LectureWithCount,
  "courseName" | "studentCount" | "absentCount" | "totalClassStudents"
> & {
  className?: string;
  courseName?: string;
  studentCount?: number | string | null;
  absentCount?: number | string | null;
  totalClassStudents?: number | string | null;
};

type LectureMutationResponse = {
  success: boolean;
  message?: string;
};

type UpdateLectureVariables = {
  lectureId: string;
  title: string;
  duration: number;
};

type LectureRollbackContext = {
  previousLectures?: LectureWithCount[];
} | null;

const getIsFreshQuery = (dataUpdatedAt: number | undefined) =>
  dataUpdatedAt != null && Date.now() - dataUpdatedAt < TEACHER_QUERY_FRESH_MS;

const mapLectureWithCount = (lecture: LectureApiItem): LectureWithCount => ({
  ...lecture,
  courseName: lecture.courseName ?? lecture.className ?? "",
  studentCount: Number(lecture.studentCount ?? 0),
  absentCount: Number(lecture.absentCount ?? 0),
  totalClassStudents: Number(lecture.totalClassStudents ?? 0),
});

export const useTeacherDashboard = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const lectureRowHeightRef = useRef(0);
  const params = useLocalSearchParams<{
    ended?: string;
    lectureId?: string;
    stress?: string;
    mock?: string;
    count?: string;
    lectures?: string;
    size?: string;
  }>();
  const { ended, lectureId } = params;

  const { alert } = useHapticAlerts();
  const [isNavigating, setIsNavigating] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LectureWithCount | null>(
    null,
  );
  const { isConnected } = useNetworkState();
  const [editTitle, setEditTitle] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const data = useMutationState({
    filters: { mutationKey: mutationKeys.lectures.create },
    select: (mutation) => mutation.state.status,
  });
  const latestCreateLectureMutation = data[data.length - 1];
  const scrollY = useSharedValue(0);
  const pullProgress = useSharedValue(0);

  const context = useSharedValue({ x: 0, y: 0 });
  const animatedTranslateY = useSharedValue(0);

  const stressOptions = useMemo(
    () =>
      getTeacherDashboardStressOptions({
        stress: params.stress || "enabled",
        mock: params.mock || "enabled",
        count: params.count || "1000",
        lectures: params.lectures,
        size: params.size,
      }),
    [params.count, params.lectures, params.mock, params.size, params.stress],
  );

  const mockLectures = useMemo<LectureWithCount[]>(
    () => (stressOptions.enabled || true ? generateMockLectures(1000) : []),
    [stressOptions.enabled],
  );
  const { user } = useAuthStore.getState();
  const userRole = user?.role || "teacher";

  const fetchActiveLecturesQueryFn = useCallback(async (): Promise<
    LectureWithCount[]
  > => {
    const res = await lectureService.getAllLectures();
    return res.success ? (res.data ?? []).map(mapLectureWithCount) : [];
  }, []);

  const { data: lectures, refetch: fetchActiveLectures } = useQuery<
    LectureWithCount[]
  >({
    queryKey: queryKeys.lectures.teacher,
    queryFn: fetchActiveLecturesQueryFn,
    networkMode: "online",
    gcTime: Infinity,
    refetchInterval: StaleTime.MINUTES_2,
    enabled: true,
  });

  const effectiveLectures = useMemo<LectureWithCount[]>(
    () => (stressOptions.enabled ? mockLectures : (lectures ?? [])),
    [lectures, mockLectures, stressOptions.enabled],
  );

  useFocusEffect(
    useCallback(() => {
      if (stressOptions.enabled) {
        return;
      }

      if (
        latestCreateLectureMutation !== "pending" &&
        latestCreateLectureMutation !== "error"
      ) {
        const queryState = queryClient.getQueryState(
          queryKeys.lectures.teacher,
        );
        const isDataFresh = getIsFreshQuery(queryState?.dataUpdatedAt);

        if (!isDataFresh) {
          fetchActiveLectures();
        }
      }
    }, [
      fetchActiveLectures,
      latestCreateLectureMutation,
      queryClient,
      stressOptions.enabled,
    ]),
  );

  useEffect(() => {
    if (stressOptions.enabled) {
      return;
    }
    if (parseEndedTrue(ended) && parseLectureId(lectureId)) {
      fetchActiveLectures();
      router.setParams({ ended: undefined, lectureId: undefined });
    }
  }, [ended, fetchActiveLectures, lectureId, router, stressOptions.enabled]);

  const handleStudentJoined = useCallback(
    ({
      lectureId,
    }: {
      lectureId: string;
      studentId: string;
      studentName: string;
    }) => {
      console.log("TeacherDashboard :: student joined :: ", lectureId);
      queryClient.setQueryData<LectureWithCount[]>(
        queryKeys.lectures.teacher,
        (old) => {
          if (!old) return [];
          return old.map((lecture) =>
            lecture.id === lectureId
              ? {
                  ...lecture,
                  studentCount: lecture.studentCount + 1,
                  absentCount: Math.max(0, (lecture.absentCount || 0) - 1),
                }
              : lecture,
          );
        },
      );
    },
    [queryClient],
  );

  const handleStudentLeaved = useCallback(
    (lectureId: string) => {
      console.log("student leaved the lecture: ", lectureId);

      queryClient.setQueryData<LectureWithCount[]>(
        queryKeys.lectures.teacher,
        (old) => {
          if (!old) return [];
          return old.map((lecture) =>
            lecture.id === lectureId
              ? {
                  ...lecture,
                  studentCount: Math.max(0, lecture.studentCount - 1),
                  absentCount: Math.min(
                    lecture.absentCount || 0 + 1,
                    lecture.totalClassStudents || 0,
                  ),
                }
              : lecture,
          );
        },
      );
    },
    [queryClient],
  );

  const lectureIds = (lectures || []).map((lecture) => lecture.id);
  useEffect(() => {
    if (stressOptions.enabled) {
      return;
    }
    // TODO: test its true reactivity.
    try {
      socketService.connect();
      lectureIds.forEach((id) =>
        socketService.joinLecture(id, userRole || "teacher"),
      );
      socketService.onStudentJoined(handleStudentJoined);
      socketService.onStudentLeaved(handleStudentLeaved);

      const appStateSubscription = AppState.addEventListener(
        "change",
        (nextAppState) => {
          if (nextAppState !== "active") {
            return;
          }

          if (!socketService.isConnected()) {
            socketService.connect();
            lectureIds.forEach((id) =>
              socketService.joinLecture(id, userRole || "teacher"),
            );
            socketService.onStudentJoined(handleStudentJoined);
            socketService.onStudentLeaved(handleStudentLeaved);
          }

          if (
            latestCreateLectureMutation !== "pending" &&
            latestCreateLectureMutation !== "error"
          ) {
            fetchActiveLectures();
          }
        },
      );

      return () => {
        lectureIds.forEach((id) => socketService.leaveLecture(id));
        socketService.offStudentJoined();
        socketService.offStudentLeaved();
        appStateSubscription.remove();
      };
    } catch {
      return undefined;
    }
  }, [
    fetchActiveLectures,
    handleStudentJoined,
    handleStudentLeaved,
    latestCreateLectureMutation,
    lectureIds,
    queryClient,
    stressOptions.enabled,
    userRole,
  ]);

  const handleEndLecture = useCallback(
    (id: string, lectureTitle: string) => {
      alert("End Lecture", "Are you sure you want to end this lecture?", [
        { text: "Cancel", style: "cancel", onPress: selectionAsync },
        {
          text: "End",
          style: "destructive",
          onPress: async () => {
            try {
              if (!isConnected) {
                showInternetNotConnected();
                return;
              }
              const res = await lectureService.endLecture(id);
              if (res.success) {
                fetchActiveLectures();
                // Prefetch passcode so lecture-ended screen loads instantly
                queryClient.prefetchQuery({
                  queryKey: queryKeys.lectures.passcode(id),
                  queryFn: async () => {
                    const res = await lectureService.getPasscode(id);
                    // Return the full response so useLectureEnded can extract passcode
                    return res.success ? res : null;
                  },
                });
                // Navigate to lecture ended screen
                router.push({
                  pathname: "/(main)/lecture-ended",
                  params: {
                    lectureId: id,
                    lectureTitle: lectureTitle,
                  },
                });
              }
            } catch (error: any) {
              alert("Error", error.message || "Failed to end lecture");
            }
          },
        },
      ]);
    },
    [alert, fetchActiveLectures, isConnected, queryClient, router],
  );

  const handleEditLecture = useCallback(
    (lecture: LectureWithCount) => {
      if (lecture.status !== "active") {
        alert("Cannot Edit", "Only active lectures can be edited.");
        return;
      }
      setEditingLecture(lecture);
      setEditTitle(lecture.title);
      setEditDuration(lecture.duration);
      setEditModalVisible(true);
    },
    [alert],
  );

  const { mutateAsync: updateLecture } = useMutation<
    LectureMutationResponse,
    Error,
    UpdateLectureVariables,
    LectureRollbackContext
  >({
    mutationKey: mutationKeys.lectures.update,
    onMutate: async (_, context) => {
      const previousLectures = (await context.client.getQueryData(
        queryKeys.lectures.teacher,
      )) as LectureWithCount[];

      if (!previousLectures) {
        return null;
      }

      const lectureToUpdate = previousLectures.find(
        (lecture) => lecture.id === editingLecture?.id,
      );

      if (!lectureToUpdate) {
        return { previousLectures };
      }

      const optimisticUpdatedLecture: LectureWithCount = {
        ...lectureToUpdate,
        title: editTitle,
        duration: editDuration,
      };

      context.client.setQueryData<LectureWithCount[]>(
        queryKeys.lectures.teacher,
        (old) => {
          if (!old) {
            return [];
          }

          return old.map((lecture) =>
            lecture.id === optimisticUpdatedLecture.id
              ? optimisticUpdatedLecture
              : lecture,
          );
        },
      );

      setEditModalVisible(false);
      return { previousLectures };
    },
    onSuccess: async (data, _, onMutateResult, context) => {
      if (data.success) {
        fetchActiveLectures();
      } else if (onMutateResult?.previousLectures) {
        context.client.setQueryData(
          queryKeys.lectures.teacher,
          onMutateResult.previousLectures,
        );
        alert("Error", "Failed to update lecture");
      }
    },
    onError(error, _, onMutateResult, context) {
      if (onMutateResult?.previousLectures) {
        context.client.setQueryData(
          queryKeys.lectures.teacher,
          onMutateResult.previousLectures,
        );
      }
      alert("Error", error.message || "Failed to update lecture");
    },
  });

  const handleUpdateLecture = useCallback(async () => {
    if (!editingLecture) return;
    if (!editTitle.trim()) {
      alert("Error", "Title cannot be empty");
      return;
    }
    const durationNum = parseInt(editDuration);
    if (isNaN(durationNum) || durationNum <= 0) {
      alert("Error", "Duration must be a positive number");
      return;
    }

    return updateLecture({
      lectureId: editingLecture.id,
      duration: durationNum,
      title: editTitle.trim(),
    });
  }, [alert, editDuration, editTitle, editingLecture, updateLecture]);

  const handleViewAttendance = useCallback(
    (lecture: LectureWithCount) => {
      router.push({
        pathname: "/(main)/view-attendance",
        params: {
          lectureId: lecture.id,
          lectureTitle: lecture.title,
        },
      });
    },
    [router],
  );

  const handleFetchTeacherClasses = useCallback(async () => {
    const response = await lectureService.getTeacherClasses();
    return response.data;
  }, []);

  const navigateToCreate = useCallback(() => {
    if (!isNavigating) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.classes.teacher,
        queryFn: handleFetchTeacherClasses,
        staleTime: 60000,
      });
      setIsNavigating(true);
      router.push("/(main)/create-lecture");
      setTimeout(() => setIsNavigating(false), 1000);
    }
  }, [handleFetchTeacherClasses, isNavigating, queryClient, router]);

  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();

  const filteredLectures = useMemo<LectureWithCount[]>(() => {
    if (!normalizedSearchQuery) {
      return effectiveLectures;
    }

    return effectiveLectures.filter((l: LectureWithCount) => {
      return (
        l.title.toLowerCase().includes(normalizedSearchQuery) ||
        l.courseName.toLowerCase().includes(normalizedSearchQuery)
      );
    });
  }, [effectiveLectures, normalizedSearchQuery]);

  const dashboardStats = useMemo(() => {
    return effectiveLectures.reduce(
      (stats, lecture: LectureWithCount) => ({
        totalActive:
          lecture.status === "active"
            ? stats.totalActive + 1
            : stats.totalActive,
        totalStudents: stats.totalStudents + Number(lecture.studentCount),
      }),
      { totalActive: 0, totalStudents: 0 },
    );
  }, [effectiveLectures]);

  // Gesture Logic
  const panGesture = Gesture.Pan()
    .activeOffsetY([-1000, 20]) // allow upward movement to be ignored by pan
    .failOffsetX([-20, 20]) // fail if horizontal movement detected first
    .onStart((event) => {
      context.value = { x: event.x, y: event.y };
    })
    .onUpdate((event) => {
      if (scrollY.value <= 0) {
        const dy = event.y - context.value.y;
        if (dy > 0) {
          const damping = 0.5;
          const translateY = dy * damping;
          if (translateY < 150) {
            animatedTranslateY.value = translateY;
            pullProgress.value = interpolate(
              translateY,
              [0, 100],
              [0, 1],
              Extrapolation.CLAMP,
            );
          }
        }
      }
    })
    .onEnd(() => {
      if (animatedTranslateY.value > 80) {
        scheduleOnRN(navigateToCreate);
      }
      animatedTranslateY.value = withSpring(0);
      pullProgress.value = withSpring(0);
    });

  const swipeGesture = Gesture.Simultaneous(panGesture, Gesture.Native());

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: animatedTranslateY.value }],
  }));

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const pullIndicatorStyle = useAnimatedStyle(() => ({
    opacity: pullProgress.value,
    transform: [
      { scale: interpolate(pullProgress.value, [0, 1], [0.8, 1.2]) },
      {
        translateY: interpolate(
          pullProgress.value,
          [0, 1],
          [0, -70],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const keyExtractor = useCallback(
    (lecture: LectureWithCount) => lecture.id,
    [],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<LectureWithCount> | null | undefined, index: number) => {
      const rowHeight =
        lectureRowHeightRef.current || DEFAULT_LECTURE_ROW_HEIGHT;
      return {
        length: rowHeight,
        offset: rowHeight * index,
        index,
      };
    },
    [lectureRowHeightRef],
  );

  
  const flatListPerformanceProps = useMemo(
    () => ({
      removeClippedSubviews: true,
      initialNumToRender: 8,
      maxToRenderPerBatch: 106,
      updateCellsBatchingPeriod: 20,
      windowSize: 106,
    }),
    [],
  );

  const { mutateAsync: deleteLecture } = useMutation<
    LectureMutationResponse,
    Error,
    {
      lecture: LectureWithCount;
    },
    LectureRollbackContext
  >({
    onMutate: (variables, context) => {
      const previousLectures = context.client.getQueryData<LectureWithCount[]>(
        queryKeys.lectures.teacher,
      );
      context.client.setQueryData<LectureWithCount[]>(
        queryKeys.lectures.teacher,
        (old) => {
          return (
            old?.filter((oldLec) => oldLec.id !== variables?.lecture.id) || []
          );
        },
      );
      return { previousLectures };
    },
    onError(_, __, onMutateResult, context) {
      if (!onMutateResult?.previousLectures) {
        return;
      }

      context.client.setQueryData<LectureWithCount[]>(
        queryKeys.lectures.teacher,
        onMutateResult.previousLectures,
      );
    },
    mutationKey: mutationKeys.lectures.delete,
  });

  const handleDeleteLecture = useCallback(
    (lecture: LectureWithCount) => {
      if (lecture.status !== "ended") {
        alert(
          "Cannot Delete",
          "Only ended lectures can be deleted. Please end the lecture first.",
        );
        return;
      }

      alert(
        "Delete Lecture",
        `Are you sure you want to delete "${lecture.title}"?`,
        [
          { text: "Cancel", style: "cancel", onPress: selectionAsync },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteLecture({ lecture });
              } catch (error: any) {
                alert("Error", error.message || "Failed to delete lecture");
              }
            },
          },
        ],
      );
    },
    [alert, deleteLecture],
  );

  return {
    pullIndicatorStyle,
    pullProgress,
    onScroll,
    scrollY,
    totalActive: dashboardStats.totalActive,
    totalStudents: dashboardStats.totalStudents,
    lectures: effectiveLectures,
    navigateToCreate,
    searchQuery,
    setSearchQuery,
    filteredLectures,
    handleViewAttendance,
    handleEditLecture,
    handleEndLecture,
    editModalVisible,
    setEditModalVisible,
    editTitle,
    setEditTitle,
    editDuration,
    setEditDuration,
    handleUpdateLecture,
    handleDeleteLecture,
    animatedContainerStyle,
    swipeGesture,
    lectureRowHeightRef,
    keyExtractor,
    getItemLayout,
    flatListPerformanceProps,
  };
};
