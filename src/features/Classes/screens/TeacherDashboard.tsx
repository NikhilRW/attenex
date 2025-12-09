import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { socketService } from "@/src/shared/services/socketService";
import { Ionicons } from "@expo/vector-icons";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  AppState,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
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
  Layout,
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

interface LectureWithCount {
  id: string;
  title: string;
  courseName: string;
  createdAt: string;
  studentCount: number;
  absentCount?: number;
  totalClassStudents?: number;
  status: "active" | "ended";
  duration: string;
}

const { width } = Dimensions.get("window");

const circlePath = Skia.Path.Make();
circlePath.addCircle(30, 30, 25);

const TeacherDashboard = () => {
  const router = useRouter();
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

  useFocusEffect(
    useCallback(() => {
      fetchActiveLectures();
    }, [fetchActiveLectures])
  );

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
  }, [lectures, fetchActiveLectures]);

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
          {/* Pull Indicator */}
          <Animated.View style={[styles.pullIndicator, pullIndicatorStyle]}>
            <View
              style={{
                width: 60,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Canvas style={{ position: "absolute", width: 60, height: 60 }}>
                <Path
                  path={circlePath}
                  color={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}
                  style="stroke"
                  strokeWidth={4}
                />
                <Path
                  path={circlePath}
                  color={colors.primary.main}
                  style="stroke"
                  strokeWidth={4}
                  start={0}
                  end={pullProgress}
                  strokeCap="round"
                />
              </Canvas>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.8)",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
              >
                <Ionicons name="add" size={24} color={colors.primary.main} />
              </View>
            </View>
            {/* <Text style={[styles.pullText, { color: colors.text.secondary, marginTop: 8 }]}>
                Create New Lecture
              </Text> */}
          </Animated.View>

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
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <View style={styles.header}>
                <View>
                  <Text
                    style={[styles.headerTitle, { color: colors.text.primary }]}
                  >
                    Dashboard
                  </Text>
                  <Text
                    style={[
                      styles.headerSubtitle,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Overview & Management
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={navigateToCreate}
                  style={[
                    styles.addButton,
                    { backgroundColor: colors.primary.main },
                  ]}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Stats Cards */}
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.statsScroll}
                contentContainerStyle={styles.statsContent}
              >
                <LinearGradient
                  colors={
                    isDark
                      ? ["rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.1)"]
                      : ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0.05)"]
                  }
                  style={[
                    styles.statsCard,
                    { borderColor: "rgba(59, 130, 246, 0.3)" },
                  ]}
                >
                  <View
                    style={[
                      styles.statsIcon,
                      { backgroundColor: "rgba(59, 130, 246, 0.2)" },
                    ]}
                  >
                    <Ionicons name="radio" size={20} color="#60A5FA" />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.statsValue,
                        { color: colors.text.primary },
                      ]}
                    >
                      {totalActive}
                    </Text>
                    <Text
                      style={[
                        styles.statsLabel,
                        { color: colors.text.secondary },
                      ]}
                    >
                      Active Now
                    </Text>
                  </View>
                </LinearGradient>

                <LinearGradient
                  colors={
                    isDark
                      ? ["rgba(16, 185, 129, 0.2)", "rgba(16, 185, 129, 0.1)"]
                      : ["rgba(16, 185, 129, 0.1)", "rgba(16, 185, 129, 0.05)"]
                  }
                  style={[
                    styles.statsCard,
                    { borderColor: "rgba(16, 185, 129, 0.3)" },
                  ]}
                >
                  <View
                    style={[
                      styles.statsIcon,
                      { backgroundColor: "rgba(16, 185, 129, 0.2)" },
                    ]}
                  >
                    <Ionicons name="people" size={20} color="#34D399" />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.statsValue,
                        { color: colors.text.primary },
                      ]}
                    >
                      {totalStudents}
                    </Text>
                    <Text
                      style={[
                        styles.statsLabel,
                        { color: colors.text.secondary },
                      ]}
                    >
                      Total Students
                    </Text>
                  </View>
                </LinearGradient>

                <LinearGradient
                  colors={
                    isDark
                      ? ["rgba(245, 158, 11, 0.2)", "rgba(245, 158, 11, 0.1)"]
                      : ["rgba(245, 158, 11, 0.1)", "rgba(245, 158, 11, 0.05)"]
                  }
                  style={[
                    styles.statsCard,
                    { borderColor: "rgba(245, 158, 11, 0.3)" },
                  ]}
                >
                  <View
                    style={[
                      styles.statsIcon,
                      { backgroundColor: "rgba(245, 158, 11, 0.2)" },
                    ]}
                  >
                    <Ionicons name="library" size={20} color="#FBBF24" />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.statsValue,
                        { color: colors.text.primary },
                      ]}
                    >
                      {lectures.length}
                    </Text>
                    <Text
                      style={[
                        styles.statsLabel,
                        { color: colors.text.secondary },
                      ]}
                    >
                      Total Lectures
                    </Text>
                  </View>
                </LinearGradient>
              </ScrollView>
            </Animated.View>

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
                  <Animated.View
                    key={lecture.id}
                    entering={FadeInDown.delay(300 + index * 100).springify()}
                    layout={Layout.springify()}
                  >
                    <LinearGradient
                      colors={
                        isDark
                          ? ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]
                          : ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.5)"]
                      }
                      style={[
                        styles.lectureCard,
                        {
                          borderColor:
                            lecture.status === "active"
                              ? "rgba(34, 197, 94, 0.4)"
                              : colors.surface.glassBorder,
                        },
                      ]}
                    >
                      <View style={styles.cardHeader}>
                        <View style={styles.cardTitleContainer}>
                          <Text
                            style={[
                              styles.cardTitle,
                              { color: colors.text.primary },
                            ]}
                          >
                            {lecture.title}
                          </Text>
                          <Text
                            style={[
                              styles.cardSubtitle,
                              { color: colors.text.secondary },
                            ]}
                          >
                            {lecture.courseName}
                          </Text>
                        </View>
                        {lecture.status === "active" ? (
                          <View style={styles.activeBadge}>
                            <View style={styles.pulsingDot} />
                            <Text style={styles.activeText}>LIVE</Text>
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor: isDark
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.05)",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusText,
                                { color: colors.text.muted },
                              ]}
                            >
                              Ended
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.cardStats}>
                        <View style={styles.statItem}>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={16}
                            color="#22C55E"
                          />
                          <Text
                            style={[
                              styles.statText,
                              { color: colors.text.secondary },
                            ]}
                          >
                            {lecture.studentCount} Present
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons
                            name="close-circle-outline"
                            size={16}
                            color="#EF4444"
                          />
                          <Text
                            style={[
                              styles.statText,
                              { color: colors.text.secondary },
                            ]}
                          >
                            {lecture.absentCount || 0} Absent
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color={colors.text.secondary}
                          />
                          <Text
                            style={[
                              styles.statText,
                              { color: colors.text.secondary },
                            ]}
                          >
                            {new Date(lecture.createdAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </Text>
                        </View>
                      </View>

                      {/* Class Info */}
                      {lecture.totalClassStudents && lecture.totalClassStudents > 0 && (
                        <View style={[
                          styles.classInfoBanner,
                          {
                            backgroundColor: isDark
                              ? "rgba(245, 158, 11, 0.1)"
                              : "rgba(245, 158, 11, 0.05)",
                            borderColor: "rgba(245, 158, 11, 0.3)",
                          }
                        ]}>
                          <Ionicons name="information-circle" size={16} color="#F59E0B" />
                          <Text style={[styles.classInfoText, { color: colors.text.secondary }]}>
                            {lecture.totalClassStudents} total students in {lecture.courseName}
                          </Text>
                        </View>
                      )}

                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: colors.surface.glassBorder },
                        ]}
                      />

                      <View style={styles.cardActions}>
                        <TouchableOpacity
                          style={[
                            styles.actionBtn,
                            {
                              backgroundColor: isDark
                                ? "rgba(59, 130, 246, 0.15)"
                                : "rgba(59, 130, 246, 0.1)",
                            },
                          ]}
                          onPress={() => handleViewAttendance(lecture)}
                        >
                          <Text style={styles.actionBtnText}>
                            View Attendance
                          </Text>
                          <Ionicons
                            name="arrow-forward"
                            size={16}
                            color="#3B82F6"
                          />
                        </TouchableOpacity>

                        <View style={styles.iconActions}>
                          {lecture.status === "active" && (
                            <>
                              <TouchableOpacity
                                style={[
                                  styles.iconBtn,
                                  {
                                    backgroundColor: isDark
                                      ? "rgba(255,255,255,0.1)"
                                      : "rgba(0,0,0,0.05)",
                                  },
                                ]}
                                onPress={() => handleEditLecture(lecture)}
                              >
                                <Ionicons
                                  name="create-outline"
                                  size={20}
                                  color={colors.text.primary}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  styles.iconBtn,
                                  {
                                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                                  },
                                ]}
                                onPress={() =>
                                  handleEndLecture(lecture.id, lecture.title)
                                }
                              >
                                <Ionicons
                                  name="stop"
                                  size={20}
                                  color="#EF4444"
                                />
                              </TouchableOpacity>
                            </>
                          )}
                          {lecture.status === "ended" && (
                            <TouchableOpacity
                              style={[
                                styles.iconBtn,
                                {
                                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                                },
                              ]}
                              onPress={() => handleDeleteLecture(lecture)}
                            >
                              <Ionicons
                                name="trash-outline"
                                size={20}
                                color="#EF4444"
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </LinearGradient>
                  </Animated.View>
                ))
              )}
            </View>
          </ScrollView>
        </Animated.View>
        {/* </GestureDetector> */}
      </GestureHandlerRootView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={FadeInUp.springify()}
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                borderColor: colors.surface.glassBorder,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              Edit Lecture
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                Title
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    color: colors.text.primary,
                    borderColor: colors.surface.glassBorder,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                  },
                ]}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Lecture Title"
                placeholderTextColor={colors.text.muted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                Duration (min)
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    color: colors.text.primary,
                    borderColor: colors.surface.glassBorder,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                  },
                ]}
                value={editDuration}
                onChangeText={setEditDuration}
                keyboardType="number-pad"
                placeholder="60"
                placeholderTextColor={colors.text.muted}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text
                  style={[styles.modalBtnText, { color: colors.text.primary }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { backgroundColor: colors.primary.main },
                ]}
                onPress={handleUpdateLecture}
              >
                <Text style={[styles.modalBtnText, { color: "white" }]}>
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statsScroll: {
    marginBottom: 24,
    marginHorizontal: -20,
    flex: 1,
  },
  statsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 160,
    gap: 12,
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statsValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statsLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  lectureCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
    gap: 6,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  activeText: {
    color: "#22C55E",
    fontSize: 12,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.2)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 13,
  },
  classInfoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  classInfoText: {
    fontSize: 12,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  actionBtnText: {
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 14,
  },
  iconActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
    opacity: 0.7,
  },
  pullIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: -10,
  },
  pullIndicatorGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  pullText: {
    color: "white",
    fontWeight: "600",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  modalBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TeacherDashboard;
