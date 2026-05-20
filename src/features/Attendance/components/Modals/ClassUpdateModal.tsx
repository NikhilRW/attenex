import { UniModal } from "@/shared/components/UnistylesComponents";
import styles from "@attendance/styles/StudentDashboard.styles";
import { ClassUpdateModalProps } from "@attendance/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const ClassModalGradient = withUnistyles(LinearGradient, (_theme, rt) => ({
  colors:
    rt.themeName === "dark"
      ? (["rgba(40, 40, 40, 0.95)", "rgba(20, 20, 20, 0.98)"] as const)
      : (["rgba(255, 255, 255, 0.95)", "rgba(245, 245, 255, 0.98)"] as const),
}));

const PrimaryGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: [theme.primary.main, theme.accent.blue] as const,
}));

const UniTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.muted,
}));

const PrimaryIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const SecondaryIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.secondary,
}));

const PrimaryTextSpinner = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.text.primary,
}));

const ClassUpdateModal = ({
  showClassModal,
  setShowClassModal,
  className,
  setClassName,
  handleUpdateClass,
  classUpdateLoading,
}: ClassUpdateModalProps) => {
  return (
    <UniModal
      visible={showClassModal}
      animationType="fade"
      onRequestClose={() => setShowClassModal(false)}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={FadeInUp.duration(400)}
          exiting={FadeOutDown.duration(400)}
          style={styles.modalAnimatedWrapper}
        >
          <ClassModalGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.modalContent, styles.modalSurfaceElevated]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
                <View style={styles.modalHeaderIconContainer}>
                  <PrimaryIcon name="school" size={20} />
                </View>
                <Text
                  style={[
                    styles.modalTitle,
                    styles.modalTitlePrimary,
                    styles.modalTitleLarge,
                  ]}
                >
                  Update Class
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowClassModal(false)}
                style={[styles.closeButton, styles.closeButtonSubtle]}
              >
                <SecondaryIcon name="close" size={20} />
              </TouchableOpacity>
            </View>

            <View style={[styles.modalBody, styles.modalBodyCompact]}>
              <Text
                style={[
                  styles.modalLabel,
                  styles.modalLabelSecondary,
                  styles.modalLabelSpaced,
                ]}
              >
                Enter your class name to join lectures
              </Text>

              <View style={styles.modalInputRow}>
                <UniTextInput
                  style={[styles.modalInputText, styles.modalButtonWrapper]}
                  value={className}
                  onChangeText={setClassName}
                  placeholder="e.g., Computer Science 101"
                />
              </View>
            </View>

            <View style={[styles.modalFooter, styles.modalFooterCompact]}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowClassModal(false)}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonTextSecondary,
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButtonWrapper}
                onPress={handleUpdateClass}
                disabled={classUpdateLoading}
              >
                <PrimaryGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                >
                  {classUpdateLoading ? (
                    <PrimaryTextSpinner />
                  ) : (
                    <Text
                      style={[
                        styles.modalButtonText,
                        styles.modalButtonTextPrimary,
                        styles.modalButtonTextBold,
                      ]}
                    >
                      Update Class
                    </Text>
                  )}
                </PrimaryGradient>
              </TouchableOpacity>
            </View>
          </ClassModalGradient>
        </Animated.View>
      </View>
    </UniModal>
  );
};

export default ClassUpdateModal;
