import {
  HeaderSection,
  LectureCard,
  LectureEditModal,
  PullIndicator,
} from "@classes/components";
import { teacherDashboardStyles as styles } from "@classes/styles";
import Ionicons from "@react-native-vector-icons/ionicons";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import { Skia } from "@shopify/react-native-skia";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  FadeInUp,
  LinearTransition,
} from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";
import { useTeacherDashboard } from "../hooks/useTeacherDashboard";
import { LectureWithCount } from "../types";

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

const TeacherDashboard = () => {
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
    pullIndicatorStyle,
    pullProgress,
    scrollY,
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
  } = useTeacherDashboard();

  return (
    <View style={styles.container}>
      <FuturisticBackground />
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
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              onScroll={(e) => {
                scrollY.value = e.nativeEvent.contentOffset.y;
              }}
              scrollEventThrottle={16}
              itemLayoutAnimation={LinearTransition.springify()}
              extraData={(e: LectureWithCount) => [
                e.id.includes("temp"),
                searchQuery,
              ]}
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
                    entering={FadeInDown.delay(200).springify()}
                    style={styles.searchContainer}
                  >
                    <SearchIcon name="search" size={20} />
                    <SearchInput
                      style={styles.searchInput}
                      placeholder="Search lectures..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <ClearIcon name="close-circle" size={20} />
                      </TouchableOpacity>
                    )}
                  </Animated.View>

                  {/* Section Title */}
                  <View style={styles.listContainer}>
                    <Text style={styles.sectionTitle}>
                      {searchQuery ? "Search Results" : "Recent Lectures"}
                    </Text>
                  </View>
                </View>
              }
              ListEmptyComponent={
                <Animated.View
                  entering={FadeInUp.springify()}
                  style={styles.emptyState}
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
              renderItem={({ item: lecture, index }) => {
                return (
                  <LectureCard
                    key={lecture.id}
                    lecture={lecture}
                    index={index}
                    handleViewAttendance={handleViewAttendance}
                    handleEditLecture={handleEditLecture}
                    handleEndLecture={handleEndLecture}
                    handleDeleteLecture={handleDeleteLecture}
                    isLectureCreating
                  />
                );
              }}
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
