import { HeaderSection } from "@classes/components/HeaderSection";
import LectureCard from "@classes/components/LectureCard";
import { LectureEditModal } from "@classes/components/LectureEditModal";
import PullIndicator from "@classes/components/PullIndicator";
import { styles } from "@classes/styles/TeacherDashboard.styles";
import { LectureWithCount } from "@classes/types/common";
import Ionicons from "@react-native-vector-icons/ionicons";
import { markPerformance } from "@shared/utils/performance";
import { Skia } from "@shopify/react-native-skia";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";
import { useTeacherDashboard } from "../hooks/useTeacherDashboard";
import { TouchableOpacity } from "@/shared/components/TouchableOpacity";

// TODO: learn legend list performance optimization

const SearchIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

const ClearIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

const EmptyStateIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

const SearchInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.muted,
}));

const circlePath = Skia.Path.Make();
circlePath.addCircle(30, 30, 25);
const DASHBOARD_CONTENT_FOCUS_ANIMATION_DURATION_MS = 360;

const TeacherDashboard = () => {
  const focusProgress = useSharedValue(1);
  const {
    editDuration,
    editModalVisible,
    editTitle,
    filteredLectures,
    handleEditLecture,
    handleEndLecture,
    handleUpdateLecture,
    handleViewAttendance,
    lectures,
    navigateToCreate,
    onScroll,
    pullIndicatorStyle,
    pullProgress,
    searchQuery,
    setEditDuration,
    setEditModalVisible,
    setEditTitle,
    setSearchQuery,
    totalActive,
    totalStudents,
    handleDeleteLecture,
    animatedContainerStyle,
    swipeGesture,
    lectureRowHeightRef,
    keyExtractor,
    getItemLayout,
    flatListPerformanceProps,
  } = useTeacherDashboard();

  useFocusEffect(
    useCallback(() => {
      focusProgress.value = 0;
      focusProgress.value = withTiming(1, {
        duration: DASHBOARD_CONTENT_FOCUS_ANIMATION_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      });
    }, [focusProgress]),
  );

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusProgress.value, [0, 0.35, 1], [0, 0, 1]),
    transform: [
      {
        translateY: interpolate(focusProgress.value, [0, 0.35, 1], [20, 20, 0]),
      },
    ],
  }));

  const sectionTitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusProgress.value, [0, 0.5, 1], [0, 0, 1]),
    transform: [
      {
        translateY: interpolate(focusProgress.value, [0, 0.5, 1], [14, 14, 0]),
      },
    ],
  }));

  const emptyStateAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusProgress.value, [0, 0.55, 1], [0, 0, 1]),
    transform: [
      {
        translateY: interpolate(focusProgress.value, [0, 0.55, 1], [18, 18, 0]),
      },
    ],
  }));

  useEffect(() => {
    markPerformance("teacher-dashboard-mount");
    const interactionHandle = requestIdleCallback(() => {
      markPerformance("teacher-dashboard-interactive");
    });

    return () => {
      cancelIdleCallback(interactionHandle);
    };
  }, []);

  const renderLectureItem = useCallback(
    ({ item: lecture, index }: { item: LectureWithCount; index: number }) => (
      <LectureCard
        lecture={lecture}
        index={index}
        handleViewAttendance={handleViewAttendance}
        handleEditLecture={handleEditLecture}
        handleEndLecture={handleEndLecture}
        handleDeleteLecture={handleDeleteLecture}
        isLectureCreating
        lectureRowHeightRef={lectureRowHeightRef}
      />
    ),
    [
      handleDeleteLecture,
      handleEditLecture,
      handleEndLecture,
      handleViewAttendance,
      lectureRowHeightRef,
    ],
  );

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.screenFill}>
        <Animated.View style={[styles.screenFill, animatedContainerStyle]}>
          <PullIndicator
            pullIndicatorStyle={pullIndicatorStyle}
            pullProgress={pullProgress}
            circlePath={circlePath}
          />

          <GestureDetector gesture={swipeGesture}>
            <Animated.FlatList
              data={filteredLectures}
              keyExtractor={keyExtractor}
              getItemLayout={getItemLayout}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
              {...flatListPerformanceProps}
              itemLayoutAnimation={LinearTransition.springify()}
              extraData={searchQuery}
              ListHeaderComponent={
                <View>
                  {/* Main Header Section */}
                  <HeaderSection
                    totalActive={totalActive}
                    totalStudents={totalStudents}
                    lectures={lectures || []}
                    navigateToCreate={navigateToCreate}
                  />

                  {/* Search Bar */}
                  <Animated.View
                    style={[styles.searchContainer, searchAnimatedStyle]}
                  >
                    <SearchIcon name="search" size={20} />
                    <SearchInput
                      style={styles.searchInput}
                      placeholder="Search lectures..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setSearchQuery("")}
                        haptic="selection"
                      >
                        <ClearIcon name="close-circle" size={20} />
                      </TouchableOpacity>
                    )}
                  </Animated.View>

                  {/* Section Title */}
                  <Animated.View
                    style={[styles.listContainer, sectionTitleAnimatedStyle]}
                  >
                    <Text style={styles.sectionTitle}>
                      {searchQuery ? "Search Results" : "Recent Lectures"}
                    </Text>
                  </Animated.View>
                </View>
              }
              ListEmptyComponent={
                <Animated.View
                  style={[styles.emptyState, emptyStateAnimatedStyle]}
                >
                  <EmptyStateIcon
                    name="search-outline"
                    size={48}
                    style={styles.emptyIcon}
                  />
                  <Text style={styles.emptyText}>
                    {searchQuery ? "No lectures found" : "No lectures yet"}
                  </Text>
                  {!searchQuery && (
                    <Text style={styles.emptySubText}>
                      Pull down to create one
                    </Text>
                  )}
                </Animated.View>
              }
              renderItem={renderLectureItem}
            />
          </GestureDetector>
        </Animated.View>
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
