import { styles } from "@classes/styles/AttendanceViewScreen.styles";
import { ManualAttendanceModalProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const ModalSurface = withUnistyles(LinearGradient, (_, rt) => ({
  colors:
    rt.themeName === "dark"
      ? (["rgba(40, 40, 40, 0.95)", "rgba(20, 20, 20, 0.98)"] as const)
      : (["rgba(255, 255, 255, 0.95)", "rgba(245, 245, 255, 0.98)"] as const),
}));

const SubmitButtonGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: [theme.primary.main, "#3B82F6"] as const,
}));

const HeaderIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const CloseIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.secondary,
}));

const InputIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

const ModalInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.muted,
}));

const SubmitIndicator = withUnistyles(ActivityIndicator, () => ({
  color: "white",
}));

export const ManualAttendanceModal: React.FC<ManualAttendanceModalProps> = ({
  visible,
  onClose,
  manualRollNo,
  setManualRollNo,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={FadeInUp.duration(400)}
          exiting={FadeOutDown.duration(400)}
          style={styles.modalAnimatedWrapper}
        >
          <ModalSurface
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.modalContent, styles.modalSurface]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalHeaderIcon}>
                  <HeaderIcon name="person-add" size={20} />
                </View>
                <Text style={styles.modalTitle}>Add Manual Attendance</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <CloseIcon name="close" size={20} />
              </TouchableOpacity>
            </View>

            <View style={[styles.modalBody, styles.modalBodyTop]}>
              <Text style={[styles.modalLabel, styles.modalLabelDescription]}>
                Enter the student&apos;s roll number to manually mark them
                present.
              </Text>

              <View style={styles.inputContainer}>
                <InputIcon
                  name="id-card-outline"
                  size={20}
                  style={styles.inputIcon}
                />
                <ModalInput
                  style={styles.input}
                  placeholder="e.g 66"
                  value={manualRollNo}
                  onChangeText={setManualRollNo}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={[styles.modalFooter, styles.modalFooterCompact]}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButtonNarrow]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSubmit}
                disabled={isSubmitting}
                style={styles.submitButtonWide}
              >
                <SubmitButtonGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.actionButton, { borderWidth: 0 }]}
                >
                  {isSubmitting ? (
                    <SubmitIndicator />
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>Mark Present</Text>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="white"
                        style={styles.submitButtonIcon}
                      />
                    </>
                  )}
                </SubmitButtonGradient>
              </TouchableOpacity>
            </View>
          </ModalSurface>
        </Animated.View>
      </View>
    </Modal>
  );
};
