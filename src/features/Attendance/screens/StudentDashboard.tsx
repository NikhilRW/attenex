import {
  getLectureDetails,
  getStudentLectures,
} from "@/src/features/Classes/services/lectureService";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { authService } from "@/src/shared/services/authService";
import { socketService } from "@/src/shared/services/socketService";
import { useAuthStore } from "@/src/shared/stores/authStore";
import { storage } from "@/src/shared/utils/mmkvStorage";
import { Lecture } from "@attendance/types/common";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, AppState, ScrollView } from "react-native";
import { joinLecture, submitAttendance } from "../services/attendanceService";
import {
  startBackgroundTracking,
  stopBackgroundTracking,
} from "../services/backgroundTask";
import styles from "../styles/StudentDashboard.styles";
import LoadingScreen from "../components/LoadingScreen";
import LectureOngoing from "../components/LectureOngoing";
import LectureEnded from "../components/LectureEnded";
import RollnoModal from "../components/RollnoModal";
import ClassUpdateModal from "../components/ClassUpdateModal";
import OnGoingLecture from "../components/OnGoingLecture";
import NoLectureFound from "../components/NoLectureFound";
import NoClassSelected from "../components/NoClassSelected";
import StudentDashboardHeader from "../components/StudentDashboardHeader";

const StudentDashboard = () => {
  const { colors } = useTheme();
  const { user, updateUser } = useAuthStore();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [joinedLecture, setJoinedLecture] = useState<Lecture | null>(null);
  const [lectureStatus, setLectureStatus] = useState<"active" | "ended">(
    "active"
  );
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "joined" | "submitting">(
    "idle"
  );
  const [showClassModal, setShowClassModal] = useState(false);
  const [className, setClassName] = useState(
    (user as any)?.className || storage.getString("userClassName") || ""
  );
  const [classUpdateLoading, setClassUpdateLoading] = useState(false);

  const [showRollNoModal, setShowRollNoModal] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [pendingLecture, setPendingLecture] = useState<Lecture | null>(null);
  const [fetchingLectureDetails, setFetchingLectureDetails] = useState(false);

  const { lectureId } = useLocalSearchParams();

  console.log("Student Dashboard : " + lectureId);

  const proceedWithJoin = useCallback(
    async (lecture: any, studentRollNo: string) => {
      setLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission denied",
            "Location is required to join class."
          );
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        const res = await joinLecture(
          lecture.id,
          location.coords.latitude,
          location.coords.longitude,
          studentRollNo
        );

        if (res.success) {
          // Update user in auth store with roll number if returned
          if (res.user && res.user.rollNo) {
            updateUser({ rollNo: res.user.rollNo as string });
          }

          setJoinedLecture(lecture);
          setLectureStatus("active");
          setStatus("joined");
          Alert.alert(
            "Joined!",
            "Location tracking started. Wait for class to end, then verify attendance."
          );
          // Start Background Task
          await startBackgroundTracking(lecture.id);
        }
      } catch (error: any) {
        console.log(error);
        Alert.alert("Join Failed", error.message || "Could not join class");
      } finally {
        setLoading(false);
      }
    },
    [updateUser]
  );

  // Fetch lecture details and auto-join when navigating from notification
  useEffect(() => {
    const fetchAndJoinLecture = async () => {
      if (lectureId) {
        // First check if we already have the lecture in our list
        const lectureToJoin = lectures.find((lec) => lec.id === lectureId);

        if (lectureToJoin) {
          await handleJoin(lectureToJoin);
        } else {
          // Fetch lecture details from API if not in list
          setFetchingLectureDetails(true);
          try {
            console.log("📥 Fetching lecture details for:", lectureId);
            const res = await getLectureDetails(lectureId as string);

            if (res.success && res.data) {
              console.log("✅ Lecture details fetched:", res.data);
              const lectureData = {
                id: res.data.id,
                title: res.data.title,
                className: res.data.classname,
                startedAt: res.data.startedAt,
              };
              await handleJoin(lectureData);
            } else {
              console.log("❌ Failed to fetch lecture details");
              Alert.alert(
                "Error",
                "Could not load lecture details. Please try again."
              );
              // Still try to join with minimal data
              await handleJoin({ id: lectureId });
            }
          } catch (error: any) {
            console.error("❌ Error fetching lecture details:", error);
            Alert.alert(
              "Error",
              error.message || "Could not load lecture details"
            );
            // Fallback: try to join with just the ID
            await handleJoin({ id: lectureId });
          } finally {
            setFetchingLectureDetails(false);
          }
        }
      }
    };

    fetchAndJoinLecture();
  }, [lectureId]);

  const handleJoin = useCallback(
    async (lecture: any) => {
      // Check if user has a roll number set
      if (!user?.rollNo) {
        setPendingLecture(lecture);
        setShowRollNoModal(true);
        return;
      }

      await proceedWithJoin(lecture, user.rollNo);
    },
    [proceedWithJoin, user]
  );

  const fetchLectures = useCallback(async () => {
    try {
      const userClassName = (user as any)?.className;
      console.log("🔍 Fetching lectures for user:", {
        userId: user?.id,
        className: userClassName,
        hasClassName: !!userClassName,
      });

      if (!userClassName) {
        console.log("⚠️ No className set for user");
        setLectures([]);
        return;
      }

      const res = await getStudentLectures(userClassName);
      console.log("📚 Lectures API response:", res);

      if (res.success) {
        setLectures(res.data || []);
        console.log("✅ Lectures set:", res.data?.length || 0);
      } else {
        console.log("❌ API returned success=false:", res.message);
        setLectures([]);
      }
    } catch (error) {
      console.log("❌ Error fetching lectures:", error);
      setLectures([]);
    }
  }, []);

  // Auto-reload lectures every 30 seconds and when user changes
  useEffect(() => {
    fetchLectures();

    // Set up interval for auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      console.log("🔄 Auto-refreshing lectures...");
      fetchLectures();
    }, 30000); // 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [user, fetchLectures]); // Refetch when user changes

  // Connect to socket on mount
  useEffect(() => {
    socketService.connect();

    // Handle app state changes (background/foreground)
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // App came back to foreground - reconnect socket and refresh lectures
        if (!socketService.isConnected()) {
          socketService.connect();
        }
        console.log("📱 App came to foreground - refreshing lectures");
        fetchLectures();
      }
    });

    return () => {
      socketService.disconnect();
      subscription.remove();
    };
  }, [fetchLectures]);

  // Listen for lecture ended events globally
  useEffect(() => {
    const handleLectureEnded = (data: {
      lectureId: string;
      status: string;
      endedAt: string;
    }) => {
      console.log("Lecture ended event received:", data);

      // Update lecture status if it matches current joined lecture
      if (joinedLecture && data.lectureId === joinedLecture.id) {
        console.log("Updating lecture status to ended");
        setLectureStatus("ended");

        // Show alert to notify student
        setTimeout(() => {
          Alert.alert(
            "Lecture Ended",
            "The teacher has ended the lecture. Please verify your attendance now with the passcode.",
            [{ text: "OK" }]
          );
        }, 100);
      }
    };

    socketService.onLectureEnded(handleLectureEnded);

    return () => {
      socketService.offLectureEnded();
    };
  }, [joinedLecture]);

  // Join/leave lecture room when joinedLecture changes
  useEffect(() => {
    if (joinedLecture) {
      socketService.joinLecture(joinedLecture.id);
      console.log(`Joined socket room for lecture: ${joinedLecture.id}`);
    }

    return () => {
      if (joinedLecture) {
        socketService.leaveLecture(joinedLecture.id);
        console.log(`Left socket room for lecture: ${joinedLecture.id}`);
      }
    };
  }, [joinedLecture]);

  const handleUpdateClass = async () => {
    if (!className.trim()) {
      Alert.alert("Error", "Please enter a class name");
      return;
    }

    setClassUpdateLoading(true);
    try {
      const response = await authService.updateStudentClass(className.trim());
      if (response.success) {
        // Save to storage for persistence
        storage.set("userClassName", className.trim());
        Alert.alert("Success", "Class updated successfully!");
        setShowClassModal(false);
        fetchLectures();
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update class");
    } finally {
      setClassUpdateLoading(false);
    }
  };

  const handleRollNoSubmit = async () => {
    if (!rollNo.trim()) {
      Alert.alert("Error", "Please enter your roll number");
      return;
    }

    setShowRollNoModal(false);
    if (pendingLecture) {
      await proceedWithJoin(pendingLecture, rollNo.trim());
      setPendingLecture(null);
      setRollNo("");
    }
  };

  const handleSubmit = async () => {
    if (!passcode || passcode.length !== 4) {
      Alert.alert("Invalid Passcode", "Please enter the 4-digit passcode.");
      return;
    }

    setLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const res = await submitAttendance(
        joinedLecture!.id,
        passcode,
        location.coords.latitude,
        location.coords.longitude
      );

      if (res.success) {
        Alert.alert("Success", "Attendance Marked Present! ✅");

        // Cleanup socket connection
        if (joinedLecture) {
          socketService.leaveLecture(joinedLecture.id);
        }

        setJoinedLecture(null);
        setStatus("idle");
        setPasscode("");
        await stopBackgroundTracking();
        fetchLectures();
      }
    } catch (error: any) {
      Alert.alert(
        "Submission Failed",
        error.message || "Could not mark attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveLecture = async () => {
    Alert.alert(
      "Leave Lecture",
      "Are you sure you want to leave this lecture? Your attendance will not be recorded.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            await stopBackgroundTracking();

            // Leave socket room
            if (joinedLecture) {
              socketService.leaveLecture(joinedLecture.id);
            }

            setJoinedLecture(null);
            setStatus("idle");
            setLectureStatus("active");
            fetchLectures();
          },
        },
      ]
    );
  };

  // Show loading screen while fetching lecture details
  if (fetchingLectureDetails) {
    return <LoadingScreen />;
  }

  // If joined and lecture is still active - show ongoing status
  if (status === "joined" && lectureStatus === "active") {
    return (
      <LectureOngoing
        joinedLecture={joinedLecture!}
        handleLeaveLecture={handleLeaveLecture}
      />
    );
  }

  // If joined and lecture ended - show verify button
  if (status === "joined" && lectureStatus === "ended") {
    return (
      <LectureEnded
        joinedLecture={joinedLecture!}
        passcode={passcode}
        setPasscode={setPasscode}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background.secondary },
      ]}
      contentContainerStyle={styles.scrollContent}
    >
      <StudentDashboardHeader
        user={user}
        setShowClassModal={setShowClassModal}
      />

      {!(user as any)?.className ? (
        <NoClassSelected setShowClassModal={setShowClassModal} />
      ) : lectures.length === 0 ? (
        <NoLectureFound fetchLectures={fetchLectures} />
      ) : (
        lectures.map((lecture) => (
          <OnGoingLecture
            key={lecture.id}
            lecture={lecture}
            loading={loading}
            handleJoin={handleJoin}
          />
        ))
      )}
      {/* Update Class Modal */}
      <ClassUpdateModal
        showClassModal={showClassModal}
        setShowClassModal={setShowClassModal}
        className={className}
        setClassName={setClassName}
        handleUpdateClass={handleUpdateClass}
        classUpdateLoading={classUpdateLoading}
      />
      {/* Roll No Modal */}
      <RollnoModal
        showRollNoModal={showRollNoModal}
        setShowRollNoModal={setShowRollNoModal}
        rollNo={rollNo}
        setRollNo={setRollNo}
        handleRollNoSubmit={handleRollNoSubmit}
        setPendingLecture={setPendingLecture}
      />
    </ScrollView>
  );
};

export default StudentDashboard;
