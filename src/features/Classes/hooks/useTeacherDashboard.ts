import { mutationKeys } from "@/shared/constants/mutationKeys";
import { queryKeys } from "@/shared/constants/queryKeys";
import { StaleTime } from "@/shared/constants/tanstackConfig";
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
import { useAlerts } from "react-native-paper-alerts";
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
  const { alert } = useAlerts();
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
        stress: params.stress,
        mock: params.mock,
        count: params.count,
        lectures: params.lectures,
        size: params.size,
      }),
    [params.count, params.lectures, params.mock, params.size, params.stress],
  );

  const mockLectures = useMemo(
    () =>
      stressOptions.enabled
        ? generateMockLectures(stressOptions.lectureCount)
        : [],
    [stressOptions.enabled, stressOptions.lectureCount],
  );

  const fetchActiveLecturesQueryFn: () => Promise<LectureWithCount[]> =
    useCallback(async () => {
      try {
        const res = await lectureService.getAllLectures();
        if (res.success) {
          const mappedLectures = res.data.map((lec: any) => ({
            ...lec,
            courseName: lec.className,
            studentCount: lec.studentCount || 0,
            absentCount: lec.absentCount || 0,
            totalClassStudents: lec.totalClassStudents || 0,
          }));

          return mappedLectures as LectureWithCount[];
        }
        return [];
      } catch (error) {
        console.log("Error fetching lectures", error);
        return [];
      }
    }, []);

  const { data: lectures, refetch: fetchActiveLectures } = useQuery({
    queryKey: queryKeys.lectures.teacher,
    queryFn: fetchActiveLecturesQueryFn,
    networkMode: "offlineFirst",
    gcTime: Infinity,
    refetchInterval: StaleTime.MINUTES_2,
    enabled: false,
  });

  const effectiveLectures = useMemo(
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
        const isDataFresh =
          queryState?.dataUpdatedAt != null &&
          Date.now() - queryState.dataUpdatedAt < StaleTime.SECONDS_30;

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

    const main = async () => {
      if (ended === "true" && lectureId) {
        fetchActiveLectures();
      }
    };
    main();
  }, [ended, fetchActiveLectures, lectureId, stressOptions.enabled]);

  useEffect(() => {
    if (stressOptions.enabled) {
      return;
    }

    const lectureIds = (lectures || []).map((lecture) => lecture.id);

    try {
      socketService.connect();
      lectureIds.forEach((id) => socketService.joinLecture(id));

      const handleStudentJoined = (data: unknown) => {
        console.log("Student joined event:", data);
        fetchActiveLectures();
      };

      const handleAttendanceSubmitted = (data: unknown) => {
        console.log("Attendance submitted event:", data);
        fetchActiveLectures();
      };

      socketService.onStudentJoined(handleStudentJoined);
      socketService.onAttendanceSubmitted(handleAttendanceSubmitted);

      const appStateSubscription = AppState.addEventListener(
        "change",
        (nextAppState) => {
          if (nextAppState !== "active") {
            return;
          }

          if (!socketService.isConnected()) {
            socketService.connect();
            lectureIds.forEach((id) => socketService.joinLecture(id));
            socketService.onStudentJoined(handleStudentJoined);
            socketService.onAttendanceSubmitted(handleAttendanceSubmitted);
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
        socketService.offAttendanceSubmitted();
        appStateSubscription.remove();
      };
    } catch (error) {
      console.log("Error updating dashboard socket listeners.", error);
      return undefined;
    }
  }, [
    lectures,
    fetchActiveLectures,
    latestCreateLectureMutation,
    stressOptions.enabled,
  ]);

  const handleEndLecture = async (id: string, lectureTitle: string) => {
    alert("End Lecture", "Are you sure you want to end this lecture?", [
      { text: "Cancel", style: "cancel" },
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
                pathname: "/(main)/classes/lecture-ended",
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
  };

  const handleEditLecture = (lecture: LectureWithCount) => {
    if (lecture.status !== "active") {
      alert("Cannot Edit", "Only active lectures can be edited.");
      return;
    }
    setEditingLecture(lecture);
    setEditTitle(lecture.title);
    setEditDuration(lecture.duration);
    setEditModalVisible(true);
  };

  const handleUpdateLecture = async () => {
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
    const res = await updateLecture({
      lectureId: editingLecture.id,
      duration: durationNum,
      title: editTitle.trim(),
    });
    return res;
  };

  const { mutateAsync: updateLecture } = useMutation<
    any,
    any,
    { lectureId: string; title: string; duration: number },
    { previousLectures: LectureWithCount[] } | null
  >({
    mutationKey: mutationKeys.lectures.update,
    onMutate: async (_, context) => {
      // Snapshot the previous value
      const previousLectures = (await context.client.getQueryData(
        queryKeys.lectures.teacher,
      )) as LectureWithCount[];

      if (!previousLectures) {
        return null;
      }

      const toBeEditedLecutre = previousLectures.find(
        (lecture) => lecture.id === editingLecture?.id,
      );

      if (!toBeEditedLecutre) {
        return { previousLectures };
      }

      const optimisticUpdatedLecture: LectureWithCount = {
        ...toBeEditedLecutre,
        title: editTitle,
        duration: editDuration,
      };

      // Optimistically update to the new value
      context.client.setQueryData<LectureWithCount[]>(
        queryKeys.lectures.teacher,
        (old) => {
          if (old) {
            return [
              ...old.filter(
                (lecture) => lecture.id !== optimisticUpdatedLecture.id,
              ),
              optimisticUpdatedLecture,
            ];
          } else {
            return [];
          }
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

  const handleViewAttendance = (lecture: LectureWithCount) => {
    router.push({
      pathname: "/(main)/classes/attendance",
      params: {
        lectureId: lecture.id,
        lectureTitle: lecture.title,
      },
    });
  };

  const handleFetchTeacherClasses = async () => {
    const response = await lectureService.getTeacherClasses();
    return response.data;
  };

  const navigateToCreate = () => {
    if (!isNavigating) {
      // Prefetch teacher classes so dropdown is instant on create-lecture screen
      queryClient.prefetchQuery({
        queryKey: queryKeys.classes.teacher,
        queryFn: handleFetchTeacherClasses,
        staleTime: 60000,
      });
      setIsNavigating(true);
      router.push("/(main)/classes/create-lecture");
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  // Filter logic - memoized to prevent recalculation on every render
  const filteredLectures = useMemo(() => {
    return effectiveLectures.filter((l) => {
      return (
        l.title.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
        l.courseName.toLowerCase().includes(deferredSearchQuery.toLowerCase())
      );
    });
  }, [effectiveLectures, deferredSearchQuery]);

  // Stats - memoized to prevent recalculation on every render
  const totalActive = useMemo(() => {
    return effectiveLectures.filter((l) => l.status === "active").length;
  }, [effectiveLectures]);

  const totalStudents = useMemo(() => {
    return effectiveLectures.reduce(
      (acc, curr) => acc + Number(curr.studentCount),
      0,
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
      maxToRenderPerBatch: 8,
      updateCellsBatchingPeriod: 40,
      windowSize: 16,
    }),
    [],
  );

  const { mutateAsync: deleteLecture } = useMutation<
    { success: boolean },
    LectureWithCount,
    {
      lecture: LectureWithCount;
    },
    any
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
      context.client.setQueryData<LectureWithCount[]>(
        queryKeys.lectures.teacher,
        onMutateResult.previousLectures,
      );
    },
    mutationKey: mutationKeys.lectures.delete,
  });

  const handleDeleteLecture = (lecture: LectureWithCount) => {
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
        { text: "Cancel", style: "cancel" },
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
  };

  return {
    pullIndicatorStyle,
    pullProgress,
    onScroll,
    scrollY,
    totalActive,
    totalStudents,
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
