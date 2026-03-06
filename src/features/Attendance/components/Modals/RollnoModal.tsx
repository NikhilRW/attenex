import { styles } from "@attendance/styles";
import { RollnoModalProps } from "@attendance/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const RollnoModalGradient = withUnistyles(LinearGradient, (_theme, rt) => ({
  colors:
    rt.colorScheme === "dark"
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
}: RollnoModalProps) => {
  return (
    <Modal
      visible={showRollNoModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowRollNoModal(false)}
    >
      <View style={styles.modalOverlay}>
        <RollnoModalGradient
          style={styles.modalContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, styles.modalTitlePrimary]}>
              Enter Roll Number
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowRollNoModal(false);
                setPendingLecture(null);
                setRollNo("");
              }}
              style={styles.closeButton}
            >
              <PrimaryTextIcon name="close" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={[styles.modalLabel, styles.modalLabelSecondary]}>
              Please enter your roll number to continue
            </Text>
            <UniTextInput
              style={[
                styles.modalInput,
                styles.modalInputField,
              ]}
              value={rollNo}
              onChangeText={setRollNo}
              placeholder="e.g., 2021001"
              keyboardType="default"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSoft]}
              onPress={() => {
                setShowRollNoModal(false);
                setPendingLecture(null);
                setRollNo("");
              }}
            >
              <Text
                style={[styles.modalButtonText, styles.modalButtonTextPrimary]}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButtonWrapper} onPress={handleRollNoSubmit}>
              <PrimaryGradient style={[styles.modalButton, styles.modalButtonPrimary]}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Submit</Text>
              </PrimaryGradient>
            </TouchableOpacity>
          </View>
        </RollnoModalGradient>
      </View>
    </Modal>
  );
};

export default RollnoModal;
