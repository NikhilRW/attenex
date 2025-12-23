import { useTheme } from "@/src/shared/hooks/useTheme";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { styles } from "../styles/AttendanceViewScreen.styles";
import { FilterType } from "../types/common";

interface AttendanceFilterProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

export const AttendanceFilter: React.FC<AttendanceFilterProps> = ({
  filter,
  setFilter,
}) => {
  const { colors, isDark } = useTheme();


  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
      style={styles.filterContainer}
    >
      {(["all", "present", "incomplete", "absent"] as FilterType[]).map(
        (f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f && {
                backgroundColor:
                  f === "present"
                    ? "#4ADE80"
                    : f === "incomplete"
                      ? "#FBBF24"
                      : f === "absent"
                        ? "#F87171"
                        : colors.primary.main,
              },
              filter !== f && {
                backgroundColor: isDark
                  ? colors.surface.glass
                  : "rgba(0, 0, 0, 0.05)",
                borderWidth: 1,
                borderColor: colors.surface.glassBorder,
              },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color: filter === f ? "white" : colors.text.secondary,
                  fontWeight: filter === f ? "700" : "500",
                },
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        )
      )}
    </Animated.View>
  );
};
