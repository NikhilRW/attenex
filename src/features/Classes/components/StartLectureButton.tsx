import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { styles } from "../styles/CreateLecture.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";

interface StartLectureButtonProps {
  loading: boolean;
  onPress: () => void;
}

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
