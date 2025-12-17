import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/CreateLecture.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";

interface CreateLectureHeaderProps {
  onBack: () => void;
}

export const CreateLectureHeader: React.FC<CreateLectureHeaderProps> = ({
  onBack,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
        New Lecture
      </Text>
    </View>
  );
};
