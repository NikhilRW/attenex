import { createLectureStyles as styles } from "@classes/styles";
import { CreateLectureHeaderProps } from "@classes/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const PrimaryTextIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.primary,
}));

export const CreateLectureHeader: React.FC<CreateLectureHeaderProps> = ({
  onBack,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <PrimaryTextIcon name="arrow-back" size={24} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>New Lecture</Text>
    </View>
  );
};
