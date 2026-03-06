import { styles } from "@attendance/styles";
import { LectureOngoingProps } from "@attendance/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { withUnistyles } from "react-native-unistyles";

const SuccessGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: [theme.accent.green, "#4CAF50"] as const,
}));

const DangerGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: [theme.accent.red, theme.status.error] as const,
}));

const PrimaryTextIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.primary,
}));

const LectureOngoing = ({
  handleLeaveLecture,
  joinedLecture,
  loading,
}: LectureOngoingProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screenContainer}>
      <View
        style={[
          styles.joinedContainer,
          styles.joinedContainerWithInset(insets.bottom),
        ]}
      >
        <View style={styles.guardianIconOuter}>
          <SuccessGradient style={styles.guardianIconInner}>
            <PrimaryTextIcon name="school" size={48} />
          </SuccessGradient>
        </View>

        <Text style={styles.guardianTitle}>Lecture Ongoing</Text>
        <Text style={styles.guardianSubtitle}>
          {joinedLecture?.title ? (
            <>
              Attending:{" "}
              <Text style={styles.leaveLectureTitleHighlight}>
                {joinedLecture.title}
              </Text>
              {"\n"}
            </>
          ) : null}
          Location tracking is active
        </Text>

        <View style={styles.ongoingInfo}>
          <View style={styles.trackingBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.trackingBadgeText}>Tracking Active</Text>
          </View>

          <Text style={styles.waitText}>Wait for your teacher to end the class</Text>
        </View>

        <TouchableOpacity
          onPress={handleLeaveLecture}
          style={styles.leaveButtonWrapper}
          disabled={loading}
        >
          <DangerGradient style={styles.leaveButton}>
            <PrimaryTextIcon name="exit-outline" size={20} />
            <Text style={styles.leaveButtonText}>Leave Lecture</Text>
          </DangerGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LectureOngoing;
