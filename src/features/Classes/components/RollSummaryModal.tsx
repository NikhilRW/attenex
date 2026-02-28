import { attendanceViewStyles as styles } from "@classes/styles";
import { RollSummaryModalProps } from "@classes/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shared/hooks";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

export const RollSummaryModal: React.FC<RollSummaryModalProps> = ({
  visible,
  onClose,
  presentRollNumbers,
  presentCount,
  incompleteCount,
  absentCount,
  onCopy,
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
          style={{ width: "100%", maxWidth: 500 }}
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
                    name="people"
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
                  Present Students
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
              <View
                style={[
                  styles.rollNumberBox,
                  {
                    backgroundColor: isDark
                      ? "rgba(0, 0, 0, 0.3)"
                      : "rgba(255, 255, 255, 0.8)",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.rollNumberText,
                    { color: colors.text.primary },
                  ]}
                  selectable
                >
                  {presentRollNumbers || "No present students"}
                </Text>
              </View>

              <View style={styles.modalStats}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: "#4ADE80" }]}>
                    {presentCount}
                  </Text>
                  <Text
                    style={[
                      styles.statLabelSmall,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Present
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: "#FBBF24" }]}>
                    {incompleteCount}
                  </Text>
                  <Text
                    style={[
                      styles.statLabelSmall,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Incomplete
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: "#F87171" }]}>
                    {absentCount}
                  </Text>
                  <Text
                    style={[
                      styles.statLabelSmall,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Absent
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.modalFooter,
                { borderTopWidth: 0, paddingTop: 10 },
              ]}
            >
              <TouchableOpacity style={{ flex: 1 }} onPress={onCopy}>
                <LinearGradient
                  colors={[colors.primary.main, "#3B82F6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.copyButton, { borderWidth: 0 }]}
                >
                  <Ionicons name="copy-outline" size={20} color="white" />
                  <Text style={styles.copyButtonText}>Copy Roll Numbers</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};
