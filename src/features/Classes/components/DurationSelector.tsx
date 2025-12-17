import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/CreateLecture.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";

interface DurationOption {
  label: string;
  value: number;
}

interface DurationSelectorProps {
  duration: number;
  customDuration: string;
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onSelectDuration: (duration: number) => void;
  onChangeCustomDuration: (text: string) => void;
  options: DurationOption[];
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  duration,
  customDuration,
  showDropdown,
  onToggleDropdown,
  onSelectDuration,
  onChangeCustomDuration,
  options,
}) => {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";

  const selectedDurationLabel =
    duration === -1
      ? "Custom"
      : options.find((opt) => opt.value === duration)?.label || "1 hour";

  return (
    <>
      <View style={[styles.inputGroupLarge, { zIndex: 15 }]}>
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          Duration
        </Text>
        <TouchableOpacity
          onPress={onToggleDropdown}
          style={[
            styles.dropdown,
            {
              backgroundColor: isDark
                ? "rgba(0, 0, 0, 0.2)"
                : "rgba(255, 255, 255, 0.5)",
              borderColor: colors.surface.glassBorder,
            },
          ]}
        >
          <Text style={[styles.dropdownText, { color: colors.text.primary }]}>
            {selectedDurationLabel}
          </Text>
          <Ionicons
            name={showDropdown ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.text.secondary}
          />
        </TouchableOpacity>

        {showDropdown && (
          <View
            style={[
              styles.dropdownMenu,
              {
                backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                borderColor: colors.surface.glassBorder,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 10,
              },
            ]}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option.label}
                onPress={() => onSelectDuration(option.value)}
                style={[
                  styles.dropdownItem,
                  {
                    backgroundColor:
                      duration === option.value
                        ? isDark
                          ? "rgba(8, 145, 178, 0.2)"
                          : "rgba(8, 145, 178, 0.1)"
                        : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    { color: colors.text.primary },
                  ]}
                >
                  {option.label}
                </Text>
                {duration === option.value && (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={colors.primary.main}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Custom Duration Input */}
      {duration === -1 && (
        <View style={[styles.inputGroup, { marginTop: -20 }]}>
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            Custom Duration (minutes)
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: isDark
                  ? "rgba(0, 0, 0, 0.2)"
                  : "rgba(255, 255, 255, 0.5)",
                borderColor: colors.surface.glassBorder,
                color: colors.text.primary,
              },
            ]}
            placeholder="Enter minutes"
            placeholderTextColor={colors.text.muted}
            value={customDuration}
            onChangeText={onChangeCustomDuration}
            keyboardType="numeric"
          />
        </View>
      )}
    </>
  );
};
