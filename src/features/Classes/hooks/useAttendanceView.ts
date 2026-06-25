import { mutationKeys } from "@/shared/constants/mutationKeys";
import { queryKeys } from "@/shared/constants/queryKeys";
import { GarbageTime, StaleTime } from "@/shared/constants/tanstackConfig";
import { useHapticAlerts } from "@/shared/hooks/useHapticAlerts";
import { useAuthStore } from "@/shared/stores/authStore";
import { lectureService } from "@classes/services/lectureService";
import { AttendanceRecord, FilterType } from "@classes/types/common";
import { socketService } from "@shared/services/socketService";
import { showMessage } from "@shared/utils/toasts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setStringAsync } from "expo-clipboard";
import { useNetworkState } from "expo-network";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppState } from "react-native";

const getMatchesFilter = (record: AttendanceRecord, filter: FilterType) =>
  filter === "all" || record.status === filter;

const DEFAULT_MANUAL_ATTENDANCE_ERROR =
  "Unable to mark attendance for this roll number.";

const getRollNumberSortValue = (rollNumber: string) => {
  const value = parseInt(rollNumber, 10);
  return Number.isNaN(value) ? null : value;
};

const getManualAttendanceErrorMessage = (error: unknown) => {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    const errorData = error as { error?: unknown; message?: unknown };

    if (typeof errorData.message === "string") {
      return errorData.message;
    }

    if (typeof errorData.error === "string") {
      return errorData.error;
    }
  }

  return DEFAULT_MANUAL_ATTENDANCE_ERROR;
};

export const useAttendanceView = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
  const lectureId = params.lectureId as string;
  const lectureTitle = params.lectureTitle as string;
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRollSummary, setShowRollSummary] = useState(false);
  const [showManualAttendance, setShowManualAttendance] = useState(false);
  const [manualRollNo, setManualRollNo] = useState("");
  const [manualAttendanceError, setManualAttendanceError] = useState("");
  const { isConnected } = useNetworkState();
  const userRole = useAuthStore((state) => state.user?.role);

  const { alert } = useHapticAlerts();

  const fetchAttendance: () => Promise<AttendanceRecord[]> =
    useCallback(async () => {
      try {
        const res = await lectureService.fetchLectureAttendance(lectureId);
        if (res.success) {
          return res.data.attendance || [];
        }
        return [];
      } catch (error: any) {
        alert("Error", error.message || "Failed to fetch attendance");
        return [];
      }
    }, [lectureId, alert]);

  const {
    data: attendance,
    isFetching: loading,
    refetch: refetchAttendance,
  } = useQuery({
    queryFn: fetchAttendance,
    queryKey: queryKeys.attendance.teacher(lectureId),
    staleTime: StaleTime.DAYS_5,
    gcTime: GarbageTime.SECONDS_30,
    enabled: false,
  });

  useEffect(() => {
    socketService.connect();
    socketService.joinLecture(lectureId, userRole || "teacher");

    const handleStudentJoined = (data: any) => {
      if (data.lectureId === lectureId) {
        refetchAttendance();
      }
    };

    const handleStudentLeaved = (data: any) => {
      if (data.lectureId === lectureId) {
        refetchAttendance();
      }
    };

    const handleAttendanceSubmitted = (data: any) => {
      if (data.lectureId === lectureId) {
        refetchAttendance();
      }
    };

    socketService.onStudentJoined(handleStudentJoined);
    socketService.onAttendanceSubmitted(handleAttendanceSubmitted);
    socketService.onStudentLeaved(handleStudentLeaved);

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState !== "active") {
        return;
      }

      if (!socketService.isConnected()) {
        socketService.connect();
        socketService.joinLecture(lectureId, userRole || "teacher");
      }
      refetchAttendance();
    });

    return () => {
      socketService.offStudentJoined();
      socketService.offAttendanceSubmitted();
      socketService.offStudentLeaved();
      subscription.remove();
    };
  }, [lectureId, refetchAttendance, userRole]);

  // Ensure connection when screen regains focus + initial data fetch with freshness check
  useFocusEffect(
    useCallback(() => {
      if (!socketService.isConnected()) {
        socketService.connect();
        socketService.joinLecture(lectureId,userRole || "teacher");
      }
      // Only fetch if data is not already fresh (e.g. from prefetch on LectureCard press)
      const queryState = queryClient.getQueryState(
        queryKeys.attendance.teacher(lectureId),
      );
      const isDataFresh =
        queryState?.dataUpdatedAt != null &&
        Date.now() - queryState.dataUpdatedAt < StaleTime.SECONDS_30;

      if (!isDataFresh) {
        refetchAttendance();
      }
      return () => {};
    }, [lectureId, queryClient, refetchAttendance, userRole]),
  );

  const filteredAttendance = useMemo(() => {
    if (!attendance?.length) {
      return [];
    }

    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return attendance.filter((record) => {
      if (!getMatchesFilter(record, filter)) {
        return false;
      }

      if (!normalizedSearchQuery) {
        return true;
      }

      return (
        record.studentName.toLowerCase().includes(normalizedSearchQuery) ||
        record.studentRollNo?.toLowerCase().includes(normalizedSearchQuery)
      );
    });
  }, [attendance, filter, searchQuery]);

  const attendanceSummary = useMemo(() => {
    const presentRollNumbers: string[] = [];

    const counts = (attendance || []).reduce(
      (summary, record) => {
        if (record.status === "present") {
          summary.presentCount += 1;
          if (record.studentRollNo) {
            presentRollNumbers.push(record.studentRollNo);
          }
        } else if (record.status === "incomplete") {
          summary.incompleteCount += 1;
        } else if (record.status === "absent") {
          summary.absentCount += 1;
        }

        return summary;
      },
      { presentCount: 0, incompleteCount: 0, absentCount: 0 },
    );

    presentRollNumbers.sort((a, b) => {
      const numA = getRollNumberSortValue(a);
      const numB = getRollNumberSortValue(b);

      if (numA !== null && numB !== null) {
        return numA - numB;
      }

      return a.localeCompare(b);
    });

    return {
      ...counts,
      presentRollNumbers: presentRollNumbers.join(", "),
    };
  }, [attendance]);

  const handleCopyRollNumbers = useCallback(async () => {
    setShowRollSummary(false);
    if (attendanceSummary.presentRollNumbers) {
      await setStringAsync(attendanceSummary.presentRollNumbers);
      showMessage({
        message: "Copied to clipboard",
        type: "success",
        duration: 2000,
      });
    } else {
      showMessage({
        message: "No present students with roll numbers",
        type: "danger",
        duration: 2000,
      });
    }
  }, [attendanceSummary.presentRollNumbers]);

  const handleManualRollNoChange = useCallback(
    (value: string) => {
      setManualRollNo(value);

      if (manualAttendanceError) {
        setManualAttendanceError("");
      }
    },
    [manualAttendanceError],
  );

  const handleShowManualAttendanceChange = useCallback((visible: boolean) => {
    setShowManualAttendance(visible);

    if (!visible) {
      setManualAttendanceError("");
    }
  }, []);

  const manualAttendance = async () => {
    const trimmedRollNo = manualRollNo.trim();

    if (!trimmedRollNo) {
      throw new Error("Please enter student roll number.");
    }

    if (!isConnected) {
      throw new Error("Kindly have an active internet connection first.");
    }

    return lectureService.addManualAttendance(lectureId, trimmedRollNo);
  };

  const { mutate: handleManualAttendance, isPending: isSubmittingManual } =
    useMutation({
      mutationKey: mutationKeys.attendance.manual,
      mutationFn: manualAttendance,
      onSuccess: async (data) => {
        if (data?.success) {
          showMessage({
            message: data.message || "Attendance marked successfully.",
            type: "success",
          });
          setManualRollNo("");
          setManualAttendanceError("");
          setShowManualAttendance(false);
          await refetchAttendance();
          return;
        }

        setManualAttendanceError(getManualAttendanceErrorMessage(data));
      },
      onError: (error) => {
        setManualAttendanceError(getManualAttendanceErrorMessage(error));
      },
    });

  return {
    lectureId,
    lectureTitle,
    loading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    filteredAttendance,
    showRollSummary,
    setShowRollSummary,
    showManualAttendance,
    setShowManualAttendance: handleShowManualAttendanceChange,
    manualRollNo,
    setManualRollNo: handleManualRollNoChange,
    manualAttendanceError,
    isSubmittingManual,
    presentRollNumbers: attendanceSummary.presentRollNumbers,
    handleCopyRollNumbers,
    handleManualAttendance,
    router,
  };
};
