import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { UniModal } from "@/shared/components/UnistylesComponents";
import { styles } from "@classes/styles/CreateLecture.styles";
import { NewClassModalProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TextInput, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const NewClassGradient = withUnistyles(LinearGradient, (_, rt) => ({
  colors:
    rt.themeName === "dark"
      ? (["rgba(40, 40, 40, 0.95)", "rgba(20, 20, 20, 0.98)"] as const)
      : (["rgba(255, 255, 255, 0.95)", "rgba(245, 245, 255, 0.98)"] as const),
}));

const PrimaryGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: [theme.primary.main, theme.accent.blue] as const,
}));

const SecondaryIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.secondary,
}));

const NewClassInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.muted,
}));

export const NewClassModal: React.FC<NewClassModalProps> = ({
  visible,
  onClose,
  newClassName,
  setNewClassName,
  onCreateClass,
  errorMessage,
}) => {
  const hasError = Boolean(errorMessage);

  const handleCreateClass = async () => {
    await onCreateClass(newClassName);
  };

  return (
    <UniModal visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={FadeInUp.duration(400)}
          exiting={FadeOutDown.duration(400)}
          style={styles.modalAnimatedWrapper}
        >
          <NewClassGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.modalContent,
              styles.modalSurfaceElevated,
              styles.modalSurfaceFlat,
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={[styles.modalTitle, styles.modalTitleInline]}>
                  Add New Class
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={styles.modalCloseButton}
                haptic="selection"
              >
                <SecondaryIcon name="close" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Class Name</Text>

              <View style={[styles.modalInputRow, hasError && styles.modalInputRowError]}>
                <NewClassInput
                  style={styles.modalInputText}
                  placeholder="e.g., Computer Science 101"
                  value={newClassName}
                  onChangeText={setNewClassName}
                />
              </View>
              {hasError && (
                <Text style={styles.modalErrorText}>{errorMessage}</Text>
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={onClose}
                haptic="selection"
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButtonWrapper}
                onPress={handleCreateClass}
                haptic="impact"
              >
                <PrimaryGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonTextPrimary}>
                    Create Class
                  </Text>
                </PrimaryGradient>
              </TouchableOpacity>
            </View>
          </NewClassGradient>
        </Animated.View>
      </View>
    </UniModal>
  );
};
