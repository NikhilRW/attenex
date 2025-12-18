import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { socketService } from "@/src/shared/services/socketService";
import { Ionicons } from "@expo/vector-icons";
import { Skia } from "@shopify/react-native-skia";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  AppState,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import {
  deleteLecture,
  endLecture,
  getAllLectures,
  getLectureDetails,
  updateLecture,
} from "../services/lectureService";
import { styles } from "../styles/TeacherDashboard.styles";
import { LectureEditModal } from "../components/LectureEditModal";
import { LectureWithCount } from "../types/common";
import LectureCard from "../components/LectureCard";
import StatisticsCard from "../components/StatisticsCard";
import { HeaderSection } from "../components/HeaderSection";
import PullIndicator from "../components/PullIndicator";
import { array } from "zod";

const circlePath = Skia.Path.Make();
circlePath.addCircle(30, 30, 25);

const TeacherDashboard = () => {
  const router = useRouter();
  const { ended, lectureId } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const [lectures, setLectures] = useState<LectureWithCount[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LectureWithCount | null>(
    null
  );
  const [editTitle, setEditTitle] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const scrollY = useSharedValue(0);
  const pullProgress = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });
  const animatedTranslateY = useSharedValue(0);

  const fetchActiveLectures = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await getAllLectures();
      if (res.success) {
        const lecturesWithCount = await Promise.all(
          res.data.map(async (lec: any) => {
            try {
              const detailsRes = await getLectureDetails(lec.id);
              return {
                ...lec,
                courseName: lec.className,
                studentCount: detailsRes.data.studentCount || 0,
                absentCount: detailsRes.data.absentCount || 0,
                totalClassStudents: detailsRes.data.totalClassStudents || 0,
              };
            } catch {
              return {
                ...lec,
                courseName: lec.className,
                studentCount: 0,
                absentCount: 0,
                totalClassStudents: 0,
              };
            }
          })
        );

        // Already sorted by most recent first from backend (desc order)
        setLectures(lecturesWithCount);
      }
    } catch (error) {
      console.log("Error fetching lectures", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  console.log("ended param:", ended);

  useFocusEffect(
    useCallback(() => {
      fetchActiveLectures();
    }, [fetchActiveLectures])
  );

  useEffect(() => {
    const main = async () => {
      if (ended === "true" && lectureId) {
        fetchActiveLectures();
      }
    };
    main();
  }, [ended, lectureId]);

  // Removed the separate fetchLectureDetails useEffect since it's now integrated into fetchActiveLectures

  // Setup socket listeners for real-time updates
  useEffect(() => {
    // Connect to socket immediately
    socketService.connect();

    // Join all lecture rooms
    lectures.forEach((lecture) => {
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
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // App came back to foreground - reconnect socket and refresh
        if (!socketService.isConnected()) {
          socketService.connect();
          lectures.forEach((lecture) => {
            socketService.joinLecture(lecture.id);
          });
          socketService.onStudentJoined(handleStudentJoined);
          socketService.onAttendanceSubmitted(handleAttendanceSubmitted);
        }
        fetchActiveLectures();
      }
    });

    // Cleanup
    return () => {
      lectures.forEach((lecture) => {
        socketService.leaveLecture(lecture.id);
      });
      socketService.offStudentJoined();
      socketService.offAttendanceSubmitted();
      subscription.remove();
    };
  }, [lectures, fetchActiveLectures, ended]);

  const handleEndLecture = async (id: string, lectureTitle: string) => {
    Alert.alert("End Lecture", "Are you sure you want to end this lecture?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await endLecture(id);
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
            Alert.alert("Error", error.message || "Failed to end lecture");
          }
        },
      },
    ]);
  };

  const handleDeleteLecture = async (lecture: LectureWithCount) => {
    if (lecture.status !== "ended") {
      Alert.alert(
        "Cannot Delete",
        "Only ended lectures can be deleted. Please end the lecture first."
      );
      return;
    }

    Alert.alert(
      "Delete Lecture",
      `Are you sure you want to delete "${lecture.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await deleteLecture(lecture.id);
              if (res.success) {
                fetchActiveLectures();
              }
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete lecture");
            }
          },
        },
      ]
    );
  };

  const handleEditLecture = (lecture: LectureWithCount) => {
    if (lecture.status !== "active") {
      Alert.alert("Cannot Edit", "Only active lectures can be edited.");
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
      Alert.alert("Error", "Title cannot be empty");
      return;
    }
    const durationNum = parseInt(editDuration);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert("Error", "Duration must be a positive number");
      return;
    }

    try {
      const res = await updateLecture(editingLecture.id, {
        title: editTitle.trim(),
        duration: durationNum,
      });
      if (res.success) {
        setEditModalVisible(false);
        fetchActiveLectures();
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update lecture");
    }
  };

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

  // Filter logic
  const filteredLectures = lectures.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalActive = lectures.filter((l) => l.status === "active").length;
  const totalStudents = lectures.reduce(
    (acc, curr) => acc + Number(curr.studentCount),
    0
  );

  // Gesture Logic
  const swipeGesture = Gesture.Pan()
    .onStart((event) => {
      context.value = { x: event.x, y: event.y };
    })
    .onUpdate((event) => {
      const dy = event.y - context.value.y;
      if (dy > 0 && scrollY.value <= 0) {
        const damping = 0.5;
        const translateY = dy * damping;
        if (translateY < 150) {
          animatedTranslateY.value = translateY;
          pullProgress.value = interpolate(
            translateY,
            [0, 100],
            [0, 1],
            Extrapolation.CLAMP
          );
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

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: animatedTranslateY.value }],
  }));

  const pullIndicatorStyle = useAnimatedStyle(() => ({
    opacity: pullProgress.value,
    transform: [
      { scale: interpolate(pullProgress.value, [0, 1], [0.8, 1.2]) },
      {
        translateY: interpolate(
          pullProgress.value,
          [0, 1],
          [0, -70],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      {isDark && <FuturisticBackground />}
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <GestureDetector gesture={swipeGesture}> */}
        <Animated.View style={[{ flex: 1 }, animatedContainerStyle]}>
          <PullIndicator
            animatedContainerStyle={animatedContainerStyle}
            pullIndicatorStyle={pullIndicatorStyle}
            pullProgress={pullProgress.value}
            circlePath={circlePath}
          />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={(e) => {
              scrollY.value = e.nativeEvent.contentOffset.y;
            }}
            scrollEventThrottle={16}
          >
            {/* Header Section */}
            <HeaderSection
              totalActive={totalActive}
              totalStudents={totalStudents}
              lectures={lectures}
              navigateToCreate={navigateToCreate}
            />

            {/* Search Bar */}
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={[
                styles.searchContainer,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                  borderColor: colors.surface.glassBorder,
                },
              ]}
            >
              <Ionicons name="search" size={20} color={colors.text.muted} />
              <TextInput
                style={[styles.searchInput, { color: colors.text.primary }]}
                placeholder="Search lectures..."
                placeholderTextColor={colors.text.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.text.muted}
                  />
                </TouchableOpacity>
              )}
            </Animated.View>

            {/* Lectures List */}
            <View style={styles.listContainer}>
              <Text
                style={[styles.sectionTitle, { color: colors.text.primary }]}
              >
                {searchQuery ? "Search Results" : "Recent Lectures"}
              </Text>

              {filteredLectures.length === 0 ? (
                <Animated.View
                  entering={FadeInUp.springify()}
                  style={styles.emptyState}
                >
                  <Ionicons
                    name="search-outline"
                    size={48}
                    color={colors.text.muted}
                    style={{ opacity: 0.5 }}
                  />
                  <Text
                    style={[styles.emptyText, { color: colors.text.muted }]}
                  >
                    {searchQuery ? "No lectures found" : "No lectures yet"}
                  </Text>
                  {!searchQuery && (
                    <Text
                      style={[
                        styles.emptySubText,
                        { color: colors.text.muted },
                      ]}
                    >
                      Pull down to create one
                    </Text>
                  )}
                </Animated.View>
              ) : (
                filteredLectures.map((lecture, index) => (
                  <LectureCard
                    key={lecture.id}
                    lecture={lecture}
                    index={index}
                    handleViewAttendance={handleViewAttendance}
                    handleEditLecture={handleEditLecture}
                    handleEndLecture={handleEndLecture}
                    handleDeleteLecture={handleDeleteLecture}
                  />
                ))
              )}
            </View>
          </ScrollView>
        </Animated.View>
        {/* </GestureDetector> */}
      </GestureHandlerRootView>

      {/* Edit Modal */}

      <LectureEditModal
        editModalVisible={editModalVisible}
        setEditModalVisible={setEditModalVisible}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editDuration={editDuration}
        setEditDuration={setEditDuration}
        handleUpdateLecture={handleUpdateLecture}
      />
    </View>
  );
};

export default TeacherDashboard;
