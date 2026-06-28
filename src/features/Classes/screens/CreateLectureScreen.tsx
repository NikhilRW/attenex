import { CreateLectureFormCard } from "@classes/components/CreateLectureFormCard";
import { CreateLectureHeader } from "@classes/components/CreateLectureHeader";
import { NewClassModal } from "@classes/components/NewClassModal";
import { NewSubjectModal } from "@classes/components/NewSubjectModal";
import { DURATION_OPTIONS } from "@classes/constants/common";
import { useCreateLectureScreen } from "@classes/hooks/useCreateLectureScreen";
import { styles } from "@classes/styles/CreateLecture.styles";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const CreateLectureScreen = () => {
  const {
    selectedSubject,
    selectedSubjectId,
    selectedClass,
    duration,
    customDuration,
    setCustomDuration,
    loading,
    existingClasses,
    existingSubjects,
    showClassDropdown,
    showSubjectDropdown,
    showDurationDropdown,
    showNewClassModal,
    showNewSubjectModal,
    newClassName,
    setNewClassName,
    newSubjectName,
    handleSubjectNameChange,
    subjectError,
    minHeightScrollView,
    handleCreateLecture,
    handleAddNewClass,
    handleAddNewSubject,
    handleCreateNewClass,
    handleCreateNewSubject,
    handleGoBack,
    handleToggleClassDropdown,
    handleToggleSubjectDropdown,
    handleSelectClass,
    handleSelectSubject,
    handleToggleDurationDropdown,
    handleSelectDuration,
    handleCloseNewClassModal,
    handleCloseNewSubjectModal,
  } = useCreateLectureScreen();

  return (
    <View style={styles.container}>
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
              existingClasses={existingClasses || []}
              showClassDropdown={showClassDropdown}
              onToggleClassDropdown={handleToggleClassDropdown}
              onSelectClass={handleSelectClass}
              onAddNewClass={handleAddNewClass}
              selectedSubject={selectedSubject}
              selectedSubjectId={selectedSubjectId}
              existingSubjects={existingSubjects || []}
              showSubjectDropdown={showSubjectDropdown}
              onToggleSubjectDropdown={handleToggleSubjectDropdown}
              onSelectSubject={handleSelectSubject}
              onAddNewSubject={handleAddNewSubject}
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

      <NewSubjectModal
        visible={showNewSubjectModal}
        onClose={handleCloseNewSubjectModal}
        newSubjectName={newSubjectName}
        setNewSubjectName={handleSubjectNameChange}
        onCreateSubject={handleCreateNewSubject}
        errorMessage={subjectError}
      />
    </View>
  );
};

export default CreateLectureScreen;
