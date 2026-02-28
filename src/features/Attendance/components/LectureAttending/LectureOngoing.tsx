import { styles } from "@attendance/styles";
import { LectureOngoingProps } from "@attendance/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shared/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LectureOngoing = ({
  handleLeaveLecture,
  joinedLecture,
  loading,
}: LectureOngoingProps) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <View
        style={[
          styles.joinedContainer,
          {
            backgroundColor: colors.surface.cardBg,
            borderColor: colors.surface.glassBorder,
            borderWidth: 1,
            marginBottom: 70 + insets.bottom,
          },
        ]}
      >
        <View style={styles.guardianIconOuter}>
          <LinearGradient
            colors={[colors.accent.green, "#4CAF50"]}
            style={styles.guardianIconInner}
          >
            <Ionicons name="school" size={48} color="white" />
          </LinearGradient>
        </View>

        <Text style={[styles.guardianTitle, { color: colors.text.primary }]}>
          Lecture Ongoing
        </Text>
        <Text
          style={[styles.guardianSubtitle, { color: colors.text.secondary }]}
        >
          {joinedLecture?.title ? (
            <>
              Attending:{" "}
              <Text style={{ fontWeight: "700", color: colors.primary.main }}>
                {joinedLecture.title}
              </Text>
              {"\n"}
            </>
          ) : null}
          Location tracking is active
        </Text>

        <View style={styles.ongoingInfo}>
          <View style={styles.trackingBadge}>
            <View
              style={[
                styles.pulseDot,
                { backgroundColor: colors.accent.green },
              ]}
            />
            <Text
              style={[styles.trackingBadgeText, { color: colors.text.primary }]}
            >
              Tracking Active
            </Text>
          </View>

          <Text style={[styles.waitText, { color: colors.text.secondary }]}>
            Wait for your teacher to end the class
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLeaveLecture}
          style={styles.leaveButtonWrapper}
          disabled={loading}
        >
          <LinearGradient
            colors={["#EF4444", "#DC2626"]}
            style={styles.leaveButton}
          >
            <Ionicons name="exit-outline" size={20} color="white" />
            <Text style={styles.leaveButtonText}>Leave Lecture</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LectureOngoing;
