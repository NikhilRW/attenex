import { styles } from "@classes/styles/CreateLecture.styles";
import { CreateLectureFormCardProps } from "@classes/types/props";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { useAlerts } from "react-native-paper-alerts";
import { withUnistyles } from "react-native-unistyles";
import { ClassSelector } from "./ClassSelector";
import { DurationSelector } from "./DurationSelector";
import { StartLectureButton } from "./StartLectureButton";
import { TopicInput } from "./TopicInput";

const CreateLectureCardGradient = withUnistyles(
  LinearGradient,
  (_theme, rt) => ({
    colors:
      rt.themeName === "dark"
        ? (["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"] as const)
        : (["rgba(255,255,255,0.9)", "rgba(255,255,255,0.5)"] as const),
  }),
);

export const CreateLectureFormCard: React.FC<CreateLectureFormCardProps> = ({
  selectedClass,
  existingClasses,
  showClassDropdown,
  onToggleClassDropdown,
  onSelectClass,
  onAddNewClass,
  lectureName,
  onLectureNameChange,
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
  const { alert } = useAlerts();

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

      <TopicInput value={lectureName} onChangeText={onLectureNameChange} />

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
          onPress={() =>
            onCreateLecture({
              customDuration,
              duration,
              lectureName,
              selectedClass,
              alert,
            })
          }
        />
      </View>
    </CreateLectureCardGradient>
  );
};
