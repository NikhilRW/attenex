import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { EaseView } from "react-native-ease";

import { CreateLectureFormCard } from "@classes/components/CreateLectureFormCard";
import { CreateLectureHeader } from "@classes/components/CreateLectureHeader";
import { NewClassModal } from "@classes/components/NewClassModal";
import { NewSubjectModal } from "@classes/components/NewSubjectModal";
import { DURATION_OPTIONS } from "@classes/constants/common";
import { useCreateLectureScreen } from "@classes/hooks/useCreateLectureScreen";
import { styles } from "@classes/styles/CreateLecture.styles";

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
    handleClassNameChange,
    newSubjectName,
    handleSubjectNameChange,
    subjectError,
    classError,
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
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { minHeight: minHeightScrollView }]}
          keyboardShouldPersistTaps="always"
        >
          <EaseView
            initialAnimate={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 120, stiffness: 900, mass: 4, delay: 100 }}
          >
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
          </EaseView>
        </ScrollView>
      </KeyboardAvoidingView>

      <NewClassModal
        visible={showNewClassModal}
        onClose={handleCloseNewClassModal}
        newClassName={newClassName}
        setNewClassName={handleClassNameChange}
        onCreateClass={handleCreateNewClass}
        errorMessage={classError}
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
