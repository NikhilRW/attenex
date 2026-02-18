import {
  HeaderSection,
  LectureCard,
  LectureEditModal,
  PullIndicator,
} from "@classes/components";
import { teacherDashboardStyles as styles } from "@classes/styles";
import { Ionicons } from "@expo/vector-icons";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import { useTheme } from "@shared/hooks";
import { Skia } from "@shopify/react-native-skia";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useTeacherDashboard } from "../hooks/useTeacherDashboard";

const circlePath = Skia.Path.Make();
circlePath.addCircle(30, 30, 25);

const TeacherDashboard = () => {
  const { colors, isDark } = useTheme();
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
  } = useTeacherDashboard();

  // TODO: Research How Both Pull Indication And The List Is Handled.
  return (
    <View style={styles.container}>
      {isDark && <FuturisticBackground />}
      {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
      {/* <GestureDetector gesture={swipeGesture}> */}
      {/* <Animated.View style={[{ flex: 1 }, animatedContainerStyle]}> */}
      <PullIndicator
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
          lectures={lectures || []}
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
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
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
              <Text style={[styles.emptyText, { color: colors.text.muted }]}>
                {searchQuery ? "No lectures found" : "No lectures yet"}
              </Text>
              {/* {!searchQuery && (
                <Text
                  style={[styles.emptySubText, { color: colors.text.muted }]}
                >
                  Pull down to create one
                </Text>
              )} */}
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
                isLectureCreating
              />
            ))
          )}
        </View>
      </ScrollView>
      {/* </Animated.View> */}
      {/* </GestureDetector> */}
      {/* </GestureHandlerRootView> */}

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
