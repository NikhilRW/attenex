import styles from "@classes/styles/AttendanceViewScreen.styles";
import { AttendanceFloatingButtonProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { TouchableOpacity } from "react-native";

export const AttendanceFloatingButton: React.FC<
  AttendanceFloatingButtonProps
> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Ionicons name="person-add" size={24} color="white" />
    </TouchableOpacity>
  );
};
