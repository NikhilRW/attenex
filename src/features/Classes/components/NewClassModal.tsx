import { useTheme } from "@/src/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { styles } from "../styles/CreateLecture.styles";
interface NewClassModalProps {
  visible: boolean;
  onClose: () => void;
  newClassName: string;
  setNewClassName: (text: string) => void;
  onCreateClass: () => void;
}

export const NewClassModal: React.FC<NewClassModalProps> = ({
  visible,
  onClose,
  newClassName,
  setNewClassName,
  onCreateClass,
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
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
                padding: 0, // Reset padding to handle internal layout
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: colors.text.primary,
                  }}
                >
                  Add New Class
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.text.secondary,
                  marginBottom: 12,
                  marginLeft: 4,
                }}
              >
                Class Name
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
                  marginBottom: 8,
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    color: colors.text.primary,
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                  placeholder="e.g., Computer Science 101"
                  placeholderTextColor={colors.text.muted}
                  value={newClassName}
                  onChangeText={setNewClassName}
                  autoFocus
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                padding: 20,
                paddingTop: 0,
                gap: 12,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                }}
                onPress={onClose}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.text.secondary,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ flex: 1 }} onPress={onCreateClass}>
                <LinearGradient
                  colors={[colors.primary.main, "#3B82F6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Create Class
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};
