import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { CreateLectureFormCard } from "../components/CreateLectureFormCard";
import { CreateLectureHeader } from "../components/CreateLectureHeader";
import { NewClassModal } from "../components/NewClassModal";
import {
  DURATION_OPTIONS,
  useCreateLectureScreen,
} from "../hooks/useCreateLectureScreen";
import { styles } from "../styles/CreateLecture.styles";

const CreateLectureScreen = () => {
  const {
    lectureName,
    setLectureName,
    selectedClass,
    duration,
    customDuration,
    setCustomDuration,
    loading,
    existingClasses,
    showClassDropdown,
    showDurationDropdown,
    showNewClassModal,
    newClassName,
    setNewClassName,
    minHeightScrollView,
    handleCreateLecture,
    handleAddNewClass,
    handleCreateNewClass,
    handleGoBack,
    handleToggleClassDropdown,
    handleSelectClass,
    handleToggleDurationDropdown,
    handleSelectDuration,
    handleCloseNewClassModal,
  } = useCreateLectureScreen();

  return (
    <View style={styles.container}>
      <FuturisticBackground />

      <CreateLectureHeader onBack={handleGoBack} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { minHeight: minHeightScrollView },
          ]}
          keyboardShouldPersistTaps="always"
        >
          <Animated.View entering={FadeInUp.delay(100).springify()}>
            <CreateLectureFormCard
              selectedClass={selectedClass}
              existingClasses={existingClasses}
              showClassDropdown={showClassDropdown}
              onToggleClassDropdown={handleToggleClassDropdown}
              onSelectClass={handleSelectClass}
              onAddNewClass={handleAddNewClass}
              lectureName={lectureName}
              onLectureNameChange={setLectureName}
              duration={duration}
              customDuration={customDuration}
              showDurationDropdown={showDurationDropdown}
              onToggleDurationDropdown={handleToggleDurationDropdown}
              onSelectDuration={handleSelectDuration}
              onChangeCustomDuration={setCustomDuration}
              durationOptions={DURATION_OPTIONS}
              loading={loading}
              onCreateLecture={handleCreateLecture}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <NewClassModal
        visible={showNewClassModal}
        onClose={handleCloseNewClassModal}
        newClassName={newClassName}
        setNewClassName={setNewClassName}
        onCreateClass={handleCreateNewClass}
      />
    </View>
  );
};

export default CreateLectureScreen;
