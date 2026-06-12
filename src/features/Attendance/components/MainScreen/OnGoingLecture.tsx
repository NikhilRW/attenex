import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { useStudentDashboardLectureAnimation } from "@attendance/hooks/useStudentDashboardFocusAnimation";
import styles from "@attendance/styles/StudentDashboard.styles";
import { OnGoingLectureProps } from "@attendance/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback } from "react";
import { ActivityIndicator, LayoutChangeEvent, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const LectureCardGradient = withUnistyles(LinearGradient, (_, rt) => ({
  colors:
    rt.themeName === "dark"
      ? (["rgba(8, 145, 178, 0.15)", "rgba(8, 145, 178, 0.3)"] as const)
      : (["rgba(8, 145, 178, 0.1)", "rgba(8, 145, 178, 0.3)"] as const),
}));

const PrimaryGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: [theme.primary.main, theme.accent.blue] as const,
}));

const PrimaryIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const SecondaryIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.secondary,
}));

const PrimaryTextIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.primary,
}));

const PrimaryTextSpinner = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.text.primary,
}));

const OnGoingLecture = ({
  index,
  lecture,
  currentLectureJoining,
  handleJoin,
  lectureHeightRef,
  joining,
}: OnGoingLectureProps) => {
  const lectureAnimatedStyle = useStudentDashboardLectureAnimation(index);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (e.nativeEvent.layout.height === 0) {
        return;
      }

      lectureHeightRef.current = e.nativeEvent.layout.height;
    },
    [lectureHeightRef],
  );

  const handlePress = useCallback(() => {
    void handleJoin(lecture);
  }, [handleJoin, lecture]);

  return (
    <Animated.View style={lectureAnimatedStyle} onLayout={handleLayout}>
      <LectureCardGradient key={lecture.id} style={styles.lectureCard}>
        <View style={styles.lectureCardHeader}>
          <View style={styles.headerLeftContent}>
            <View style={styles.iconContainer}>
              <PrimaryIcon name="easel" size={22} />
            </View>
            <View style={styles.lectureInfo}>
              <Text style={styles.lectureCardTitle} numberOfLines={1}>
                {lecture.title}
              </Text>
              <View style={styles.lectureMetaRow}>
                <SecondaryIcon
                  name="school-outline"
                  size={12}
                  style={styles.lectureMetaIcon}
                />
                <Text style={styles.lectureClassName}>
                  {lecture!.className}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={handlePress}
          disabled={joining}
          activeOpacity={0.9}
          haptic="impact"
        >
          <PrimaryGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.joinButton}
          >
            <Text style={styles.joinButtonText}>Join Class Now</Text>
            {currentLectureJoining && joining ? (
              <PrimaryTextSpinner
                size="small"
                style={styles.joinButtonLoader}
              />
            ) : (
              <View style={styles.joinIconContainer}>
                <PrimaryTextIcon name="arrow-forward" size={18} />
              </View>
            )}
          </PrimaryGradient>
        </TouchableOpacity>
      </LectureCardGradient>
    </Animated.View>
  );
};

export default OnGoingLecture;
