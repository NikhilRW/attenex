import { createLectureStyles as styles } from "@classes/styles";
import { DurationSelectorProps } from "@classes/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const DurationTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.muted,
}));

const AddCircleIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.secondary,
}));

const PrimaryIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const SecondaryIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.secondary,
}));

const SelectionModalGradient = withUnistyles(LinearGradient, (_theme, rt) => ({
  colors:
    rt.colorScheme === "dark"
      ? (["rgba(40, 40, 40, 0.95)", "rgba(20, 20, 20, 0.98)"] as const)
      : (["rgba(255, 255, 255, 0.95)", "rgba(245, 245, 255, 0.98)"] as const),
}));

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  duration,
  customDuration,
  showDropdown,
  onToggleDropdown,
  onSelectDuration,
  onChangeCustomDuration,
  options,
}) => {

  const selectedDurationLabel =
    duration === -1
      ? "Custom"
      : options.find((opt) => opt.value === duration)?.label || "1 hour";

  return (
    <>
      <View style={[styles.inputGroupLarge, styles.inputGroupDuration]}>
        <Text style={styles.label}>
          Duration
        </Text>
        <TouchableOpacity
          onPress={onToggleDropdown}
          style={styles.dropdown}
        >
          <Text style={styles.dropdownText}>
            {selectedDurationLabel}
          </Text>
          <AddCircleIcon name={"add-circle-sharp"} size={20} />
        </TouchableOpacity>
      </View>

      {/* Custom Duration Input */}
      {duration === -1 && (
        <View style={[styles.inputGroup, styles.customDurationGroup]}>
          <Text style={styles.label}>
            Custom Duration (minutes)
          </Text>
          <DurationTextInput
            style={styles.textInput}
            placeholder="Enter minutes"
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
            style={styles.modalBackdrop}
            onPress={onToggleDropdown}
            activeOpacity={1}
          />
          <Animated.View
            entering={FadeInUp.springify()}
            style={styles.modalAnimatedWrapper}
          >
            <SelectionModalGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.modalContent, styles.modalSurface, styles.modalSurfaceFlat]}
            >
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalTitle, styles.modalTitleInline]}>
                  Select Duration
                </Text>
                <TouchableOpacity
                  onPress={onToggleDropdown}
                  style={styles.modalCloseButton}
                >
                  <SecondaryIcon name="close" size={20} />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsWrapper}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    onPress={() => onSelectDuration(option.value)}
                    style={[
                      styles.optionItem,
                      duration === option.value && styles.optionItemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionItemText,
                        duration === option.value ? styles.optionItemTextSelected : null,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {duration === option.value && (
                      <PrimaryIcon name="checkmark-circle" size={20} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </SelectionModalGradient>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};
