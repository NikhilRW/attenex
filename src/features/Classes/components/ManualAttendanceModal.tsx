import { useTheme } from "@/src/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { styles } from "../styles/AttendanceViewScreen.styles";

interface ManualAttendanceModalProps {
  visible: boolean;
  onClose: () => void;
  manualRollNo: string;
  setManualRollNo: (text: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ManualAttendanceModal: React.FC<ManualAttendanceModalProps> = ({
  visible,
  onClose,
  manualRollNo,
  setManualRollNo,
  onSubmit,
  isSubmitting,
}) => {
  const { colors, isDark } = useTheme();


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
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="person-add"
                    size={20}
                    color={colors.primary.main}
                  />
                </View>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: colors.text.primary, fontSize: 22 },
                  ]}
                >
                  Add Manual Attendance
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                  },
                ]}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.modalBody, { paddingTop: 10 }]}>
              <Text
                style={[
                  styles.modalLabel,
                  { color: colors.text.secondary, marginBottom: 12 },
                ]}
              >
                Enter the student's roll number to manually mark them present.
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isDark
                    ? "rgba(0, 0, 0, 0.3)"
                    : "rgba(255, 255, 255, 0.8)",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  paddingHorizontal: 16,
                  height: 56,
                }}
              >
                <Ionicons
                  name="id-card-outline"
                  size={20}
                  color={colors.text.muted}
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  style={{
                    flex: 1,
                    color: colors.text.primary,
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                  placeholder="e.g 66"
                  placeholderTextColor={colors.text.muted}
                  value={manualRollNo}
                  onChangeText={setManualRollNo}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  autoFocus={true}
                />
              </View>
            </View>

            <View
              style={[
                styles.modalFooter,
                { borderTopWidth: 0, paddingTop: 10 },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    width: "30%",
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                  },
                ]}
                onPress={onClose}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: colors.text.secondary },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSubmit}
                disabled={isSubmitting}
                style={{
                  width: "60%",
                  height: 48,
                  borderRadius: 12,
                  flexDirection: "row",
                  paddingHorizontal: 5,
                }}
              >
                <LinearGradient
                  colors={[colors.primary.main, "#3B82F6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.modalButton, { borderWidth: 0 }]}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Text
                        style={[
                          styles.modalButtonText,
                          { color: "white", fontWeight: "700" },
                        ]}
                      >
                        Mark Present
                      </Text>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="white"
                        style={{ marginLeft: 8 }}
                      />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};
