import { lectureService } from "@classes/services/lectureService";
import { teacherDashboardStyles as styles } from "@classes/styles";
import { LectureCardProps } from "@classes/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import { queryKeys } from "@shared/constants/queryKeys";
import { useTheme } from "@shared/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const LectureCard: React.FC<LectureCardProps> = ({
  lecture,
  index,
  handleViewAttendance,
  handleEditLecture,
  handleEndLecture,
  handleDeleteLecture,
}) => {
  const { colors, isDark } = useTheme();
  const queryClient = useQueryClient();
  const isPending = lecture.id.includes("temp");
  const opacity = useSharedValue(1);
  const shimmerTranslate = useSharedValue(-1);

  useEffect(() => {
    if (isPending) {
      // Pulse animation
      opacity.value = withRepeat(
        withTiming(0.5, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );

      // Shimmer effect
      shimmerTranslate.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      opacity.value = withTiming(1, { duration: 300 });
      shimmerTranslate.value = -1;
    }
  }, [isPending, opacity, shimmerTranslate]);

  const animatedLoadingState = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const fetchLectureAttendance = async () => {
    const result = await lectureService.fetchLectureAttendance(lecture.id);
    return result.data.attendance;
  };

  return (
    <Animated.View
      key={lecture.id}
      entering={FadeInDown.delay(300 + index * 100).springify()}
      layout={LinearTransition.springify()}
      style={animatedLoadingState}
    >
      <LinearGradient
        colors={
          isPending
            ? isDark
              ? ["rgba(59, 130, 246, 0.12)", "rgba(0 0 0 / 0.05)"]
              : ["rgba(60 134 252 / 0.15)", "rgba(76 144 254 / 0.05)"]
            : isDark
              ? ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]
              : ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.5)"]
        }
        style={[
          styles.lectureCard,
          {
            borderColor: isPending
              ? "rgba(137 183 255 / 0.4)"
              : lecture.status === "active"
                ? "rgba(34, 197, 94, 0.4)"
                : colors.surface.glassBorder,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
              {lecture.title}
            </Text>
            <Text
              style={[styles.cardSubtitle, { color: colors.text.secondary }]}
            >
              {lecture.courseName}
            </Text>
          </View>
          {isPending ? (
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                },
              ]}
            >
              <Ionicons
                name="hourglass-outline"
                size={12}
                color="#3B82F6"
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.statusText, { color: "#3B82F6" }]}>
                Creating...
              </Text>
            </View>
          ) : lecture.status === "active" ? (
            <View style={styles.activeBadge}>
              <View style={styles.pulsingDot} />
              <Text style={styles.activeText}>LIVE</Text>
            </View>
          ) : (
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            >
              <Text style={[styles.statusText, { color: colors.text.muted }]}>
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
            <Text style={[styles.statText, { color: colors.text.secondary }]}>
              {lecture.studentCount} Present
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
            <Text style={[styles.statText, { color: colors.text.secondary }]}>
              {lecture.absentCount || 0} Absent
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="time-outline"
              size={16}
              color={colors.text.secondary}
            />
            <Text style={[styles.statText, { color: colors.text.secondary }]}>
              {new Date(lecture.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.surface.glassBorder },
          ]}
        />

        <View style={styles.cardActions}>
          <TouchableOpacity
            disabled={isPending}
            style={[
              styles.actionBtn,
              {
                backgroundColor: isDark
                  ? "rgba(59, 130, 246, 0.15)"
                  : "rgba(59, 130, 246, 0.1)",
              },
            ]}
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
                  style={[
                    styles.iconBtn,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.05)",
                    },
                  ]}
                  onPress={() => handleEditLecture(lecture)}
                >
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={colors.text.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isPending}
                  style={[
                    styles.iconBtn,
                    {
                      backgroundColor: "rgba(239, 68, 68, 0.15)",
                    },
                  ]}
                  onPress={() => handleEndLecture(lecture.id, lecture.title)}
                >
                  <Ionicons name="stop" size={20} color="#EF4444" />
                </TouchableOpacity>
              </>
            )}
            {lecture.status === "ended" && (
              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  {
                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                  },
                ]}
                onPress={() => handleDeleteLecture(lecture)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default LectureCard;
