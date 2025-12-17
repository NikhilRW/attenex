import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/CreateLecture.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { ClassItem } from "../types/common";

interface ClassSelectorProps {
  selectedClass: string;
  existingClasses: ClassItem[];
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onSelectClass: (className: string) => void;
  onAddNewClass: () => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  selectedClass,
  existingClasses,
  showDropdown,
  onToggleDropdown,
  onSelectClass,
  onAddNewClass,
}) => {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <View style={[styles.inputGroup, { zIndex: 20 }]}>
      <Text style={[styles.label, { color: colors.text.secondary }]}>
        Class Name
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
        <Text
          style={[
            styles.dropdownText,
            {
              color: selectedClass ? colors.text.primary : colors.text.muted,
            },
          ]}
        >
          {selectedClass || "Select a class"}
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
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
            {existingClasses.map((cls) => (
              <TouchableOpacity
                key={cls.id}
                onPress={() => onSelectClass(cls.name)}
                style={[
                  styles.dropdownItem,
                  {
                    backgroundColor:
                      selectedClass === cls.name
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
                  {cls.name}
                </Text>
                {selectedClass === cls.name && (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={colors.primary.main}
                  />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={onAddNewClass}
              style={[
                styles.addClassButton,
                {
                  borderTopColor: colors.surface.glassBorder,
                  borderTopWidth: 1,
                },
              ]}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={colors.primary.main}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.addClassButtonText,
                  { color: colors.primary.main },
                ]}
              >
                Add New Class
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
};
