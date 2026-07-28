import React from "react";
import { Text } from "react-native";

import Animated, { FadeInDown } from "react-native-reanimated";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { styles } from "@classes/styles/AttendanceViewScreen.styles";
import { FilterType } from "@classes/types/common";
import { AttendanceFilterProps } from "@classes/types/props";

import { getFilterButtonStyle } from "../utils/common";

export const AttendanceFilter: React.FC<AttendanceFilterProps> = ({ filter, setFilter }) => {
  return (
    <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.filterContainer}>
      {(["all", "present", "incomplete", "absent"] as FilterType[]).map((f) => (
        <TouchableOpacity
          key={f}
          haptic="selection"
          style={[styles.filterButton, getFilterButtonStyle(f)]}
          onPress={() => setFilter(f)}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === f ? styles.filterButtonTextActive : styles.filterButtonTextInactive,
            ]}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};
