import { socketService } from "@/src/shared/services/socketService";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, AppState, Clipboard } from "react-native";
import {
  addManualAttendance,
  fetchLectureAttendance,
} from "../services/lectureService";
import { AttendanceRecord, FilterType } from "../types/common";

export const useAttendanceView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const lectureId = params.lectureId as string;
  const lectureTitle = params.lectureTitle as string;

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRollSummary, setShowRollSummary] = useState(false);
  const [showManualAttendance, setShowManualAttendance] = useState(false);
  const [manualRollNo, setManualRollNo] = useState("");
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchLectureAttendance(lectureId);
      if (res.success) {
        setAttendance(res.data.attendance);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  }, [lectureId]);

  // Separate ref to avoid stale closures in socket callbacks
  const fetchAttendanceRef = React.useRef(fetchAttendance);
  React.useEffect(() => {
    fetchAttendanceRef.current = fetchAttendance;
  }, [fetchAttendance]);

  useEffect(() => {
    fetchAttendance();

    // Connect to socket and join lecture room for real-time updates
    socketService.connect();
    socketService.joinLecture(lectureId);

    // Listen for student joined events
    const handleStudentJoined = (data: any) => {
      console.log("Student joined event received:", data);
      if (data.lectureId === lectureId) {
        fetchAttendanceRef.current();
      }
    };

    // Listen for attendance submission events
    const handleAttendanceSubmitted = (data: any) => {
      console.log("Attendance submitted event received:", data);
      if (data.lectureId === lectureId) {
        fetchAttendanceRef.current();
      }
    };

    socketService.onStudentJoined(handleStudentJoined);
    socketService.onAttendanceSubmitted(handleAttendanceSubmitted);

    // Handle app state changes (background/foreground)
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        if (!socketService.isConnected()) {
          socketService.connect();
          socketService.joinLecture(lectureId);
          socketService.onStudentJoined(handleStudentJoined);
          socketService.onAttendanceSubmitted(handleAttendanceSubmitted);
        }
        fetchAttendanceRef.current();
      }
    });

    // Cleanup on unmount
    return () => {
      socketService.leaveLecture(lectureId);
      socketService.offStudentJoined();
      socketService.offAttendanceSubmitted();
      subscription.remove();
    };
  }, [lectureId]);

  // Ensure connection when screen regains focus
  useFocusEffect(
    useCallback(() => {
      fetchAttendanceRef.current();

      if (!socketService.isConnected()) {
        socketService.connect();
        socketService.joinLecture(lectureId);
      }

      return () => {};
    }, [lectureId])
  );

  const filteredAttendance = attendance.filter((record) => {
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

  const presentCount = attendance.filter((r) => r.status === "present").length;
  const incompleteCount = attendance.filter(
    (r) => r.status === "incomplete"
  ).length;
  const absentCount = attendance.filter((r) => r.status === "absent").length;

  const getPresentRollNumbers = () => {
    return attendance
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
      Alert.alert("Copied!", "Roll numbers copied to clipboard");
    } else {
      Alert.alert("No Data", "No present students with roll numbers");
    }
  };

  const handleManualAttendance = async () => {
    if (!manualRollNo.trim()) {
      Alert.alert("Error", "Please enter student roll number");
      return;
    }

    try {
      setIsSubmittingManual(true);
      const res = await addManualAttendance(lectureId, manualRollNo.trim());
      if (res.success) {
        Alert.alert("Success", res.message);
        setManualRollNo("");
        setShowManualAttendance(false);
        await fetchAttendance();
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add manual attendance");
    } finally {
      setIsSubmittingManual(false);
    }
  };

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
