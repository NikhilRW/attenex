import { lectureService } from "@classes/services/lectureService";
import { styles } from "@classes/styles/TeacherDashboard.styles";
import { LectureCardProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { queryKeys } from "@shared/constants/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const PendingGradient = withUnistyles(LinearGradient, (_, rt) => ({
  colors:
    rt.colorScheme === "dark"
      ? (["rgba(59, 130, 246, 0.12)", "rgba(0 0 0 / 0.05)"] as const)
      : (["rgba(60 134 252 / 0.15)", "rgba(76 144 254 / 0.05)"] as const),
}));

const DefaultGradient = withUnistyles(LinearGradient, (_, rt) => ({
  colors:
    rt.colorScheme === "dark"
      ? (["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"] as const)
      : (["rgba(255,255,255,0.9)", "rgba(255,255,255,0.5)"] as const),
}));

const TimeIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.secondary,
}));

const EditIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.primary,
}));

const LectureCard: React.FC<LectureCardProps> = ({
  lecture,
  handleViewAttendance,
  handleEditLecture,
  handleEndLecture,
  handleDeleteLecture,
  lectureRowHeightRef,
}) => {
  const queryClient = useQueryClient();
  const isPending = lecture.id.includes("temp");
  const opacity = useSharedValue(1);
  
  useEffect(() => {
    if (isPending) {
      opacity.value = withRepeat(
        withTiming(0.5, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
      return;
    }

    opacity.value = withTiming(1, { duration: 150 });
  }, [isPending, opacity]);

  const CardGradient = isPending ? PendingGradient : DefaultGradient;

  const animatedLoadingState = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const fetchLectureAttendance = async () => {
    const result = await lectureService.fetchLectureAttendance(lecture.id);
    return result.data.attendance;
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    if (lectureRowHeightRef.current === 0) {
      lectureRowHeightRef.current = e.nativeEvent.layout.height;
    }
  };

  return (
    <Animated.View
      onLayout={handleLayout}
      key={lecture.id}
      style={animatedLoadingState}
    >
      <CardGradient
        style={[
          styles.lectureCard,
          isPending
            ? styles.lectureCardBorderPending
            : lecture.status === "active"
              ? styles.lectureCardBorderActive
              : styles.lectureCardBorderDefault,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{lecture.title}</Text>
            <Text style={styles.cardSubtitle}>{lecture.courseName}</Text>
          </View>
          {isPending ? (
            <View style={[styles.statusBadge, styles.statusBadgePending]}>
              <Ionicons
                name="hourglass-outline"
                size={12}
                color="#3B82F6"
                style={styles.metaIconSpacing}
              />
              <Text style={[styles.statusText, styles.statusTextPending]}>
                Creating...
              </Text>
            </View>
          ) : lecture.status === "active" ? (
            <View style={styles.activeBadge}>
              <View style={styles.pulsingDot} />
              <Text style={styles.activeText}>LIVE</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, styles.statusBadgeEnded]}>
              <Text style={[styles.statusText, styles.statusTextEnded]}>
                Ended
              </Text>
            </View>
          )}
        </View>

        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color="#22C55E"
            />
            <Text style={styles.statText}>{lecture.studentCount} Present</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
            <Text style={styles.statText}>
              {lecture.absentCount || 0} Absent
            </Text>
          </View>
          <View style={styles.statItem}>
            <TimeIcon name="time-outline" size={16} />
            <Text style={styles.statText}>
              {new Date(lecture.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardActions}>
          <TouchableOpacity
            disabled={isPending}
            style={[styles.actionBtn, styles.actionBtnPrimary]}
            onPressIn={() => {
              if (!isPending) {
                queryClient.prefetchQuery({
                  queryKey: queryKeys.attendance.teacher(lecture.id),
                  queryFn: fetchLectureAttendance,
                  staleTime: 20000,
                });
              }
            }}
            onPress={() => handleViewAttendance(lecture)}
          >
            <Text style={styles.actionBtnText}>View Attendance</Text>
            <Ionicons name="arrow-forward" size={16} color="#3B82F6" />
          </TouchableOpacity>

          <View style={styles.iconActions}>
            {lecture.status === "active" && (
              <>
                <TouchableOpacity
                  disabled={isPending}
                  style={[styles.iconBtn, styles.iconBtnNeutral]}
                  onPress={() => handleEditLecture(lecture)}
                >
                  <EditIcon name="create-outline" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isPending}
                  style={[styles.iconBtn, styles.iconBtnDanger]}
                  onPress={() => handleEndLecture(lecture.id, lecture.title)}
                >
                  <Ionicons name="stop" size={20} color="#EF4444" />
                </TouchableOpacity>
              </>
            )}
            {lecture.status === "ended" && (
              <TouchableOpacity
                style={[styles.iconBtn, styles.iconBtnDanger]}
                onPress={() => handleDeleteLecture(lecture)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CardGradient>
    </Animated.View>
  );
};

export default LectureCard;
