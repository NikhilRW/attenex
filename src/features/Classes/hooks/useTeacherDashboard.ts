import { mutationKeys } from "@/shared/constants/mutationKeys";
import { queryKeys } from "@/shared/constants/queryKeys";
import { StaleTime } from "@/shared/constants/tanstackConfig";
import { lectureService } from "@classes/services/lectureService";
import { LectureWithCount } from "@classes/types/common";
import { socketService } from "@shared/services/socketService";
import { useMutation, useMutationState, useQuery } from "@tanstack/react-query";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, NativeEventSubscription } from "react-native";
import { useAlerts } from "react-native-paper-alerts";
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export const useTeacherDashboard = () => {
  const router = useRouter();
  const { ended, lectureId } = useLocalSearchParams();
  const { alert } = useAlerts();
  const [isNavigating, setIsNavigating] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LectureWithCount | null>(
    null,
  );
  const [editTitle, setEditTitle] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const data = useMutationState({
    filters: { mutationKey: mutationKeys.lectures.create },
    select: (mutation) => mutation.state.status,
  });
  const latestCreateLectureMutation = data[data.length - 1];
  const subscriptionRef = useRef<NativeEventSubscription>(null);
  // Animation values
  const scrollY = useSharedValue(0);
  const pullProgress = useSharedValue(0);
  // const context = useSharedValue({ x: 0, y: 0 });
  // const animatedTranslateY = useSharedValue(0);

  // For testing purposes
  // const printTheMutationCache = () => {
  //   const cache = queryClient.getMutationCache();
  //   const createClassCache = cache;
  //   console.log("cache : " + JSON.stringify(createClassCache));
  // };

  const fetchActiveLecturesQueryFn: () => Promise<LectureWithCount[]> =
    useCallback(async () => {
      try {
        const res = await lectureService.getAllLectures();
        if (res.success) {
          const lecturesWithCount = await Promise.all(
            res.data.map(async (lec: LectureWithCount) => {
              try {
                const detailsRes =
                  await lectureService.getTeacherLectureDetails(lec.id);
                return {
                  ...lec,
                  courseName: (lec as any).className,
                  studentCount: detailsRes.data.studentCount || 0,
                  absentCount: detailsRes.data.absentCount || 0,
                  totalClassStudents: detailsRes.data.totalClassStudents || 0,
                };
              } catch {
                return {
                  ...lec,
                  courseName: (lec as any).className,
                  studentCount: 0,
                  absentCount: 0,
                  totalClassStudents: 0,
                };
              }
            }),
          );

          return lecturesWithCount as LectureWithCount[];
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

  useFocusEffect(
    useCallback(() => {
      if (
        latestCreateLectureMutation !== "pending" &&
        latestCreateLectureMutation !== "error"
      ) {
        fetchActiveLectures();
      }
    }, [fetchActiveLectures, latestCreateLectureMutation]),
  );

  useEffect(() => {
    const main = async () => {
      if (ended === "true" && lectureId) {
        fetchActiveLectures();
      }
    };
    main();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ended, lectureId]);

  // Setup socket listeners for real-time updates
  useQuery({
    queryKey: queryKeys.socket.teacherDashboard,
    queryFn: () => {
      try {
        socketService.connect();

        // Join all lecture rooms
        (lectures || []).forEach((lecture) => {
          socketService.joinLecture(lecture.id);
        });

        // Listen for student join events (use stable callback)
        const handleStudentJoined = (data: any) => {
          console.log("Student joined event:", data);
          // Refresh lecture list to update student count
          fetchActiveLectures();
        };

        // Listen for attendance submission events (use stable callback)
        const handleAttendanceSubmitted = (data: any) => {
          console.log("Attendance submitted event:", data);
          // Refresh lecture list to update student count
          fetchActiveLectures();
        };

        socketService.onStudentJoined(handleStudentJoined);
        socketService.onAttendanceSubmitted(handleAttendanceSubmitted);

        // Handle app state changes (background/foreground)
        subscriptionRef.current = AppState.addEventListener(
          "change",
          (nextAppState) => {
            if (nextAppState === "active") {
              // App came back to foreground - reconnect socket and refresh
              if (!socketService.isConnected()) {
                socketService.connect();
                (lectures || []).forEach((lecture) => {
                  socketService.joinLecture(lecture.id);
                });
                socketService.onStudentJoined(handleStudentJoined);
                socketService.onAttendanceSubmitted(handleAttendanceSubmitted);
              }
              if (
                latestCreateLectureMutation !== "pending" &&
                latestCreateLectureMutation !== "error"
              ) {
                fetchActiveLectures();
              }
            }
          },
        );
        return true;
      } catch (error) {
        console.log("Error Updating Screen With Sokcet  Updates.", error);
        return false;
      }
    },
  });

  useEffect(() => {
    return () => {
      (lectures || []).forEach((lecture) => {
        socketService.leaveLecture(lecture.id);
      });
      socketService.offStudentJoined();
      socketService.offAttendanceSubmitted();
      subscriptionRef.current?.remove();
    };
  }, [lectures, fetchActiveLectures, ended, latestCreateLectureMutation]);

  const handleEndLecture = async (id: string, lectureTitle: string) => {
    alert("End Lecture", "Are you sure you want to end this lecture?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await lectureService.endLecture(id);
            if (res.success) {
              fetchActiveLectures();
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

  const handleDeleteLecture = async (lecture: LectureWithCount) => {
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
              const res = await lectureService.deleteLecture(lecture.id);
              if (res.success) {
                fetchActiveLectures();
              }
            } catch (error: any) {
              alert("Error", error.message || "Failed to delete lecture");
            }
          },
        },
      ],
    );
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

  const handleUpdateLectureMutateFn = async () => {
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
    const res = await lectureService.updateLecture(editingLecture.id, {
      title: editTitle.trim(),
      duration: durationNum,
    });
    return res;
  };

  const { mutateAsync: handleUpdateLecture } = useMutation({
    mutationFn: handleUpdateLectureMutateFn,
    mutationKey: mutationKeys.lectures.update,
    onMutate: async (_, context) => {
      // Snapshot the previous value
      const previousLetures = (await context.client.getQueryData(
        queryKeys.lectures.teacher,
      )) as LectureWithCount[];

      if (!previousLetures) {
        return null;
      }

      const toBeEditedLecutre = previousLetures.find(
        (lecture) => lecture.id === editingLecture?.id,
      );

      if (!toBeEditedLecutre) {
        return { previousLetures };
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
      return { previousLetures };
    },
    onSuccess: async (data, _, onMutateResult, context) => {
      if (data.success) {
        fetchActiveLectures();
      } else if (onMutateResult) {
        context.client.setQueryData(
          queryKeys.lectures.teacher,
          onMutateResult.previousLetures,
        );
        alert("Error", "Failed to update lecture");
      }
    },
    onError(error, _, onMutateResult, context) {
      if (onMutateResult) {
        context.client.setQueryData(
          queryKeys.lectures.teacher,
          onMutateResult.previousLetures,
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

  const navigateToCreate = () => {
    if (!isNavigating) {
      setIsNavigating(true);
      router.push("/(main)/classes/create-lecture");
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  // Filter logic - memoized to prevent recalculation on every render
  const filteredLectures = useMemo(() => {
    return (lectures || []).filter((l) => {
      return (
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.courseName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [lectures, searchQuery]);

  // Stats - memoized to prevent recalculation on every render
  const totalActive = useMemo(() => {
    return (lectures || []).filter((l) => l.status === "active").length;
  }, [lectures]);

  const totalStudents = useMemo(() => {
    return (lectures || []).reduce(
      (acc, curr) => acc + Number(curr.studentCount),
      0,
    );
  }, [lectures]);

  // Gesture Logic
  // const swipeGesture = Gesture.Pan()
  //   .onStart((event) => {
  //     context.value = { x: event.x, y: event.y };
  //   })
  //   .onUpdate((event) => {
  //     const dy = event.y - context.value.y;
  //     if (dy > 0 && scrollY.value <= 0) {
  //       const damping = 0.5;
  //       const translateY = dy * damping;
  //       if (translateY < 150) {
  //         animatedTranslateY.value = translateY;
  //         pullProgress.value = interpolate(
  //           translateY,
  //           [0, 100],
  //           [0, 1],
  //           Extrapolation.CLAMP
  //         );
  //       }
  //     }
  //   })
  //   .onEnd(() => {
  //     if (animatedTranslateY.value > 80) {
  //       scheduleOnRN(navigateToCreate);
  //     }
  //     animatedTranslateY.value = withSpring(0);
  //     pullProgress.value = withSpring(0);
  //   });

  // const animatedContainerStyle = useAnimatedStyle(() => ({
  //   transform: [{ translateY: animatedTranslateY.value }],
  // }));

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

  return {
    pullIndicatorStyle,
    pullProgress,
    scrollY,
    totalActive,
    totalStudents,
    lectures,
    navigateToCreate,
    searchQuery,
    setSearchQuery,
    filteredLectures,
    handleViewAttendance,
    handleEditLecture,
    handleEndLecture,
    handleDeleteLecture,
    editModalVisible,
    setEditModalVisible,
    editTitle,
    setEditTitle,
    editDuration,
    setEditDuration,
    handleUpdateLecture,
  };
};
