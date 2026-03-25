import { styles } from "@classes/styles/AttendanceViewScreen.styles";
import { RollSummaryModalProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const ModalSurface = withUnistyles(LinearGradient, (_, rt) => ({
  colors:
    rt.colorScheme === "dark"
      ? (["rgba(40, 40, 40, 0.95)", "rgba(20, 20, 20, 0.98)"] as const)
      : (["rgba(255, 255, 255, 0.95)", "rgba(245, 245, 255, 0.98)"] as const),
}));

const CopyGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: [theme.primary.main, "#3B82F6"] as const,
}));

const HeaderIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const CloseIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.secondary,
}));

export const RollSummaryModal: React.FC<RollSummaryModalProps> = ({
  visible,
  onClose,
  presentRollNumbers,
  presentCount,
  incompleteCount,
  absentCount,
  onCopy,
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
          style={styles.modalAnimatedWrapperWide}
        >
          <ModalSurface
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.modalContent, styles.modalSurface]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalHeaderIcon}>
                  <HeaderIcon name="people" size={20} />
                </View>
                <Text style={styles.modalTitle}>Present Students</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <CloseIcon name="close" size={20} />
              </TouchableOpacity>
            </View>

            <View style={[styles.modalBody, styles.modalBodyTop]}>
              <View style={styles.rollNumberBox}>
                <Text style={styles.rollNumberText} selectable>
                  {presentRollNumbers || "No present students"}
                </Text>
              </View>

              <View style={styles.modalStats}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: "#4ADE80" }]}>
                    {presentCount}
                  </Text>
                  <Text style={styles.statLabelSmall}>Present</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: "#FBBF24" }]}>
                    {incompleteCount}
                  </Text>
                  <Text style={styles.statLabelSmall}>Incomplete</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: "#F87171" }]}>
                    {absentCount}
                  </Text>
                  <Text style={styles.statLabelSmall}>Absent</Text>
                </View>
              </View>
            </View>

            <View style={[styles.modalFooter, styles.modalFooterCompact]}>
              <TouchableOpacity style={{ flex: 1 }} onPress={onCopy}>
                <CopyGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.copyButton}
                >
                  <Ionicons name="copy-outline" size={20} color="white" />
                  <Text style={styles.copyButtonText}>Copy Roll Numbers</Text>
                </CopyGradient>
              </TouchableOpacity>
            </View>
          </ModalSurface>
        </Animated.View>
      </View>
    </Modal>
  );
};
