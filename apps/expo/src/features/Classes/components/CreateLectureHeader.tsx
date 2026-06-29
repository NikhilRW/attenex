import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { styles } from "@classes/styles/CreateLecture.styles";
import { CreateLectureHeaderProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { Text, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const PrimaryTextIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.primary,
}));

export const CreateLectureHeader: React.FC<CreateLectureHeaderProps> = ({
  onBack,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} haptic="selection" style={styles.backButton}>
        <PrimaryTextIcon name="arrow-back" size={24} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>New Lecture</Text>
    </View>
  );
};
