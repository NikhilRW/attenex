import { attendanceViewStyles as styles } from "@classes/styles";
import { AttendanceFloatingButtonProps } from "@classes/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

export const AttendanceFloatingButton: React.FC<
    AttendanceFloatingButtonProps
> = ({ onPress, color }) => {
    return (
        <TouchableOpacity
            style={[styles.fab, { backgroundColor: color }]}
            onPress={onPress}
        >
            <Ionicons name="person-add" size={24} color="white" />
        </TouchableOpacity>
    );
};
