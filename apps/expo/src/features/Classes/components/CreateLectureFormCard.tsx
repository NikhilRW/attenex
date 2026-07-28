import React from "react";
import { Text, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { withUnistyles } from "react-native-unistyles";

import { useHapticAlerts } from "@/shared/hooks/useHapticAlerts";
import { styles } from "@classes/styles/CreateLecture.styles";
import { CreateLectureFormCardProps } from "@classes/types/props";
import { SubjectSelector } from "@shared/components/SubjectSelector";

import { ClassSelector } from "./ClassSelector";
import { DurationSelector } from "./DurationSelector";
import { StartLectureButton } from "./StartLectureButton";

const CreateLectureCardGradient = withUnistyles(LinearGradient, (_theme, { themeName }) => ({
  colors:
    themeName === "dark"
      ? (["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"] as const)
      : (["rgba(255,255,255,0.9)", "rgba(255,255,255,0.5)"] as const),
}));

export const CreateLectureFormCard: React.FC<CreateLectureFormCardProps> = ({
  selectedClass,
  existingClasses,
  showClassDropdown,
  onToggleClassDropdown,
  onSelectClass,
  onAddNewClass,
  selectedSubject,
  selectedSubjectId,
  existingSubjects,
  showSubjectDropdown,
  onToggleSubjectDropdown,
  onSelectSubject,
  onAddNewSubject,
  duration,
  customDuration,
  showDurationDropdown,
  onToggleDurationDropdown,
  onSelectDuration,
  onChangeCustomDuration,
  durationOptions,
  loading,
  onCreateLecture,
}: CreateLectureFormCardProps) => {
  const { alert } = useHapticAlerts();
  return (
    <CreateLectureCardGradient style={styles.card}>
      <Text style={styles.cardEyebrow}>Class Details</Text>

      <ClassSelector
        selectedClass={selectedClass}
        existingClasses={existingClasses}
        showDropdown={showClassDropdown}
        onToggleDropdown={onToggleClassDropdown}
        onSelectClass={onSelectClass}
        onAddNewClass={onAddNewClass}
      />

      <SubjectSelector
        selectedSubject={selectedSubject}
        existingSubjects={existingSubjects}
        showDropdown={showSubjectDropdown}
        onToggleDropdown={onToggleSubjectDropdown}
        onSelectSubject={onSelectSubject}
        onAddNewSubject={onAddNewSubject}
      />

      <View style={styles.sectionDivider} />

      <Text style={styles.cardEyebrow}>Time & Duration</Text>

      <DurationSelector
        duration={duration}
        customDuration={customDuration}
        showDropdown={showDurationDropdown}
        onToggleDropdown={onToggleDurationDropdown}
        onSelectDuration={onSelectDuration}
        onChangeCustomDuration={onChangeCustomDuration}
        options={durationOptions}
      />

      <View>
        <StartLectureButton
          loading={loading}
          testID="CREATE_LECTURE_SCREEN.START_LECTURE.BUTTON"
          onPress={() =>
            onCreateLecture({
              customDuration,
              duration,
              selectedSubject,
              selectedSubjectId,
              selectedClass,
              alert,
            })
          }
        />
      </View>
    </CreateLectureCardGradient>
  );
};
