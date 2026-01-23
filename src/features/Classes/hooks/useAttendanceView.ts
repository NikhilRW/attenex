import { queryKeys } from "@/shared/constants/queryKeys";
import { GarbageTime, StaleTime } from "@/shared/constants/tanstackConfig";
import { lectureService } from "@classes/services/lectureService";
import { AttendanceRecord, FilterType } from "@classes/types";
import { socketService } from "@shared/services/socketService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, NativeEventSubscription } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { useAlerts } from "react-native-paper-alerts";

export const useAttendanceView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const lectureId = params.lectureId as string;
  const lectureTitle = params.lectureTitle as string;
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRollSummary, setShowRollSummary] = useState(false);
  const [showManualAttendance, setShowManualAttendance] = useState(false);
  const [manualRollNo, setManualRollNo] = useState("");
  const appStateSubsription = useRef<NativeEventSubscription>(null);

  const { alert } = useAlerts();

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
    }, [lectureId]);

  const {
    data: attendance,
    isFetching: loading,
    refetch: refetchAttendance,
  } = useQuery({
    queryFn: fetchAttendance,
    queryKey: queryKeys.fetchAttendanceForTeacher.withLectureId(lectureId),
    staleTime: StaleTime.DAYS_5,
    gcTime: GarbageTime.SECONDS_30,
  });

  useQuery({
    queryFn: () => {
      // Connect to socket and join lecture room for real-time updates
      socketService.connect();
      socketService.joinLecture(lectureId);

      // Listen for student joined events
      const handleStudentJoined = (data: any) => {
        console.log("Student joined event received:", data);
        if (data.lectureId === lectureId) {
          refetchAttendance();
        }
      };

      // Listen for student absent events
      const handleStudentLeaved = (data: any) => {
        console.log("Student leave data received:", data);
        if (data.lectureId === lectureId) {
          refetchAttendance();
        }
      };

      // Listen for attendance submission events
      const handleAttendanceSubmitted = (data: any) => {
        console.log("Attendance submitted event received:", data);
        if (data.lectureId === lectureId) {
          refetchAttendance();
        }
      };

      socketService.onStudentJoined(handleStudentJoined);
      socketService.onAttendanceSubmitted(handleAttendanceSubmitted);
      socketService.onStudentLeaved(handleStudentLeaved);

      // Handle app state changes (background/foreground)
      appStateSubsription.current = AppState.addEventListener(
        "change",
        (nextAppState) => {
          if (nextAppState === "active") {
            if (!socketService.isConnected()) {
              socketService.connect();
              socketService.joinLecture(lectureId);
              socketService.onStudentJoined(handleStudentJoined);
              socketService.onAttendanceSubmitted(handleAttendanceSubmitted);
              socketService.onStudentLeaved(handleStudentLeaved);
            }
            refetchAttendance();
          }
        },
      );
      return "data-fetched";
    },
    queryKey: queryKeys.socketAttendanceViewTeacher,
  });

  // Clean up on unmount
  useEffect(() => {
    return () => {
      socketService.leaveLecture(lectureId);
      socketService.offStudentJoined();
      socketService.offAttendanceSubmitted();
      socketService.offStudentLeaved();
      appStateSubsription.current?.remove();
    };
  }, [lectureId]);

  // Ensure connection when screen regains focus
  useFocusEffect(
    useCallback(() => {
      refetchAttendance();
      if (!socketService.isConnected()) {
        socketService.connect();
        socketService.joinLecture(lectureId);
      }
      return () => {};
    }, [lectureId, refetchAttendance]),
  );

  const filteredAttendance = (attendance || []).filter((record) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "present"
          ? record.status === "present"
          : filter === "incomplete"
            ? record.status === "incomplete"
            : record.status === "absent";

    const matchesSearch =
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.studentRollNo &&
        record.studentRollNo.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const presentCount = (attendance || []).filter(
    (r) => r.status === "present",
  ).length;
  const incompleteCount = (attendance || []).filter(
    (r) => r.status === "incomplete",
  ).length;
  const absentCount = (attendance || []).filter(
    (r) => r.status === "absent",
  ).length;

  const getPresentRollNumbers = () => {
    return (attendance || [])
      .filter((r) => r.status === "present")
      .map((r) => r.studentRollNo)
      .filter((roll) => roll !== null && roll !== "")
      .sort((a, b) => {
        const numA = parseInt(a!);
        const numB = parseInt(b!);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a!.localeCompare(b!);
      })
      .join(", ");
  };

  const handleCopyRollNumbers = () => {
    const rollNumbers = getPresentRollNumbers();
    if (rollNumbers) {
      Clipboard.setString(rollNumbers);
      alert("Copied!", "Roll numbers copied to clipboard");
    } else {
      alert("No Data", "No present students with roll numbers");
    }
  };

  const manualAttendance = async () => {
    if (!manualRollNo.trim()) {
      alert("Error", "Please enter student roll number");
      return;
    }
    const res = await lectureService.addManualAttendance(
      lectureId,
      manualRollNo.trim(),
    );
    return res;
  };

  const { mutateAsync: handleManualAttendance, isPending: isSubmittingManual } =
    useMutation({
      mutationFn: manualAttendance,
      onSuccess: async (data) => {
        if (data.success) {
          alert("Success", data.message);
          setManualRollNo("");
          setShowManualAttendance(false);
          await refetchAttendance();
        }
      },
      onError: (error) => {
        alert(
          "Error",
          error.message || "Failed to add manual attendance",
        );
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
    setShowManualAttendance,
    manualRollNo,
    setManualRollNo,
    isSubmittingManual,
    presentCount,
    incompleteCount,
    absentCount,
    getPresentRollNumbers,
    handleCopyRollNumbers,
    handleManualAttendance,
    router,
  };
};
