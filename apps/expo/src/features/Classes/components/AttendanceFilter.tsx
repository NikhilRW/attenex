import React from "react";
import { Text } from "react-native";

import { EaseView } from "react-native-ease";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { styles } from "@classes/styles/AttendanceViewScreen.styles";
import { AttendanceFilterProps } from "@classes/types/props";

export const AttendanceFilter: React.FC<AttendanceFilterProps> = ({ filter, setFilter }) => {
  return (
    <EaseView
      initialAnimate={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 120, stiffness: 900, mass: 4, delay: 200 }}
      style={styles.filterContainer}
    >
      {(["all", "present", "incomplete", "absent"] as const).map((f) => (
        <TouchableOpacity
          key={f}
          haptic="selection"
          style={[
            styles.filterButton,
            filter === f ? styles.filterButtonActive : styles.filterButtonInactive,
          ]}
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
    </EaseView>
  );
};
