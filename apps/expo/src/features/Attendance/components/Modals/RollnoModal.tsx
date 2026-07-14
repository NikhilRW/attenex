import React from "react";
import { Text, TextInput, View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { withUnistyles } from "react-native-unistyles";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { UniModal } from "@/shared/components/UnistylesComponents";
import styles from "@attendance/styles/StudentDashboard.styles";
import { RollnoModalProps } from "@attendance/types/props";

const RollnoModalGradient = withUnistyles(LinearGradient, (_theme, rt) => ({
  colors:
    rt.themeName === "dark"
      ? (["rgba(30, 30, 30, 0.95)", "rgba(20, 20, 20, 0.98)"] as const)
      : (["rgba(255, 255, 255, 0.95)", "rgba(240, 240, 240, 0.98)"] as const),
}));

const UniTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.muted,
}));

const PrimaryGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: [theme.primary.main, theme.accent.blue] as const,
}));

const PrimaryTextIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.primary,
}));

const RollnoModal = ({
  showRollNoModal,
  setShowRollNoModal,
  rollNo,
  setRollNo,
  handleRollNoSubmit,
  setPendingLecture,
  errorMessage,
}: RollnoModalProps) => {
  const hasError = Boolean(errorMessage);

  return (
    <UniModal
      visible={showRollNoModal}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={() => setShowRollNoModal(false)}
    >
      <View style={styles.modalContainer}>
        <RollnoModalGradient
          style={styles.modalContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, styles.modalTitlePrimary]}>Enter Roll Number</Text>
            <TouchableOpacity
              onPress={() => {
                setShowRollNoModal(false);
                setPendingLecture(null);
                setRollNo("");
              }}
              haptic="selection"
              style={styles.closeButton}
            >
              <PrimaryTextIcon name="close" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={[styles.modalLabel, styles.modalLabelSecondary]}>
              Please enter your roll number to continue
            </Text>
            <View
              style={[
                styles.modalInput,
                styles.modalInputField,
                hasError && styles.inputContainerError,
              ]}
            >
              <UniTextInput
                style={styles.modalInputText}
                value={rollNo}
                onChangeText={setRollNo}
                placeholder="e.g., 2021001"
                keyboardType="default"
                autoCapitalize="characters"
                testID="STUDENT_DASHBOARD.ROLL_NO_REQUIRED_MODAL.TEXT_INPUT"
              />
            </View>
            {hasError ? <Text style={styles.rollnoModalError}>{errorMessage}</Text> : null}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSoft]}
              onPress={() => {
                setShowRollNoModal(false);
                setPendingLecture(null);
                setRollNo("");
              }}
              // TODO: ask ai is it right to have like this here selection and thier impact let's see.
              haptic="selection"
            >
              <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButtonWrapper}
              onPress={handleRollNoSubmit}
              haptic="impact"
              testID="STUDENT_DASHBOARD.ROLL_NO_REQUIRED_MODAL.SUBMIT_BUTTON"
            >
              <PrimaryGradient style={[styles.modalButton, styles.modalButtonPrimary]}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Submit</Text>
              </PrimaryGradient>
            </TouchableOpacity>
          </View>
        </RollnoModalGradient>
      </View>
    </UniModal>
  );
};

export default RollnoModal;
