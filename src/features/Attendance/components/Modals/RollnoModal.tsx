import { styles } from "@attendance/styles";
import { RollnoModalProps } from "@attendance/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shared/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

const RollnoModal = ({
  showRollNoModal,
  setShowRollNoModal,
  rollNo,
  setRollNo,
  handleRollNoSubmit,
  setPendingLecture,
}: RollnoModalProps) => {
  const { isDark, colors } = useTheme();
  return (
    <Modal
      visible={showRollNoModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowRollNoModal(false)}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={
            isDark
              ? ["rgba(30, 30, 30, 0.95)", "rgba(20, 20, 20, 0.98)"]
              : ["rgba(255, 255, 255, 0.95)", "rgba(240, 240, 240, 0.98)"]
          }
          style={[
            styles.modalContent,
            { borderColor: colors.surface.glassBorder },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
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
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={[styles.modalLabel, { color: colors.text.secondary }]}>
              Please enter your roll number to continue
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  color: colors.text.primary,
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)",
                  borderColor: colors.surface.glassBorder,
                },
              ]}
              value={rollNo}
              onChangeText={setRollNo}
              placeholder="e.g., 2021001"
              placeholderTextColor={colors.text.muted}
              keyboardType="default"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                {
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)",
                },
              ]}
              onPress={() => {
                setShowRollNoModal(false);
                setPendingLecture(null);
                setRollNo("");
              }}
            >
              <Text
                style={[styles.modalButtonText, { color: colors.text.primary }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: colors.primary.main },
              ]}
              onPress={handleRollNoSubmit}
            >
              <Text style={[styles.modalButtonText, { color: "white" }]}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default RollnoModal;
