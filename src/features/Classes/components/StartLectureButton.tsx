import { createLectureStyles as styles } from "@classes/styles";
import { StartLectureButtonProps } from "@classes/types";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const PrimarySpinner = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.text.primary,
}));

export const StartLectureButton: React.FC<StartLectureButtonProps> = ({
  loading,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        loading && styles.primaryButtonDisabled,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <PrimarySpinner />
      ) : (
        <Text style={styles.primaryButtonText}>Start Lecture</Text>
      )}
    </TouchableOpacity>
  );
};
