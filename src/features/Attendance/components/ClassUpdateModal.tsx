import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { colors } from "@/src/shared/constants/colors";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/StudentDashboard.styles";
import { Ionicons } from "@expo/vector-icons";

const ClassUpdateModal = ({
  showClassModal,
  setShowClassModal,
  className,
  setClassName,
  handleUpdateClass,
  classUpdateLoading,
}: {
  showClassModal: boolean;
  setShowClassModal: React.Dispatch<React.SetStateAction<boolean>>;
  className: string;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
  handleUpdateClass: () => void;
  classUpdateLoading: boolean;
}) => {
  const { isDark } = useTheme();
  return (
    <Modal
      visible={showClassModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowClassModal(false)}
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
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
                // elevation: 10,
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
                    name="school"
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
                  Update Class
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowClassModal(false)}
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
                Enter your class name to join lectures
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
                <TextInput
                  style={{
                    flex: 1,
                    color: colors.text.primary,
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                  value={className}
                  onChangeText={setClassName}
                  placeholder="e.g., Computer Science 101"
                  placeholderTextColor={colors.text.muted}
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
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                  },
                ]}
                onPress={() => setShowClassModal(false)}
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
                style={{ flex: 1 }}
                onPress={handleUpdateClass}
                disabled={classUpdateLoading}
              >
                <LinearGradient
                  colors={[colors.primary.main, "#3B82F6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.modalButton, { borderWidth: 0 }]}
                >
                  {classUpdateLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text
                      style={[
                        styles.modalButtonText,
                        { color: "white", fontWeight: "700" },
                      ]}
                    >
                      Update Class
                    </Text>
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

export default ClassUpdateModal;
