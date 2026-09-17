import React from "react";
import { ActivityIndicator, Text } from "react-native";

import { withUnistyles } from "react-native-unistyles";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { styles } from "@classes/styles/CreateLecture.styles";
import { StartLectureButtonProps } from "@classes/types/props";

const PrimarySpinner = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.text.primary,
}));

export const StartLectureButton: React.FC<StartLectureButtonProps> = ({
  loading,
  onPress,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
      onPress={onPress}
      disabled={loading}
      haptic="impact"
      testID={testID}
    >
      {loading ? <PrimarySpinner /> : <Text style={styles.primaryButtonText}>Start Lecture</Text>}
    </TouchableOpacity>
  );
};
