import { createLectureStyles as styles } from "@classes/styles";
import { CreateLectureHeaderProps } from "@classes/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shared/hooks";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
