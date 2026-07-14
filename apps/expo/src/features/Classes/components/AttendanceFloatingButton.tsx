import React from "react";

import Ionicons from "@react-native-vector-icons/ionicons";

import { styles } from "@classes/styles/AttendanceViewScreen.styles";
import { AttendanceFloatingButtonProps } from "@classes/types/props";
import { TouchableOpacity } from "@shared/components/TouchableOpacity";

export const AttendanceFloatingButton: React.FC<AttendanceFloatingButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.fab} haptic="impact" onPress={onPress}>
      <Ionicons name="person-add" size={24} color="white" />
    </TouchableOpacity>
  );
};
