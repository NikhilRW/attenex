import { createLectureStyles as styles } from "@classes/styles";
import { StartLectureButtonProps } from "@classes/types";
import { useTheme } from "@shared/hooks";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export const StartLectureButton: React.FC<StartLectureButtonProps> = ({
  loading,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        {
          backgroundColor: colors.primary.main,
          opacity: loading ? 0.7 : 1,
        },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.primaryButtonText}>Start Lecture</Text>
      )}
    </TouchableOpacity>
  );
};
