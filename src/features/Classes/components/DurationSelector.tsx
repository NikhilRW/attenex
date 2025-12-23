import { useTheme } from "@/src/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { styles } from "../styles/CreateLecture.styles";

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
  const { colors, isDark } = useTheme();

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
            name={"add-circle-sharp"}
            size={20}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Custom Duration Input */}
      {duration === -1 && (
        <View style={[styles.inputGroup, { marginTop: 10 }]}>
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

      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={onToggleDropdown}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ width: "100%", height: "100%", position: "absolute" }}
            onPress={onToggleDropdown}
            activeOpacity={1}
          />
          <Animated.View
            entering={FadeInUp.springify()}
            style={{ width: "100%", maxWidth: 400 }}
          >
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(40, 40, 40, 0.95)", "rgba(20, 20, 20, 0.98)"]
                  : ["rgba(255, 255, 255, 0.95)", "rgba(245, 245, 255, 0.98)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.modalContent,
                {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.8)",
                  borderWidth: 1,
                  padding: 0,
                  overflow: "hidden",
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: colors.text.primary,
                  }}
                >
                  Select Duration
                </Text>
                <TouchableOpacity
                  onPress={onToggleDropdown}
                  style={{
                    padding: 8,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                    borderRadius: 20,
                  }}
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ padding: 16 }}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    onPress={() => onSelectDuration(option.value)}
                    style={{
                      padding: 16,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: 12,
                      marginBottom: 8,
                      backgroundColor:
                        duration === option.value
                          ? isDark
                            ? "rgba(8, 145, 178, 0.15)"
                            : "rgba(8, 145, 178, 0.1)"
                          : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          duration === option.value
                            ? colors.primary.main
                            : colors.text.primary,
                        fontWeight: duration === option.value ? "600" : "500",
                      }}
                    >
                      {option.label}
                    </Text>
                    {duration === option.value && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={colors.primary.main}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};
