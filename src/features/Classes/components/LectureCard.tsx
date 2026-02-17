import { teacherDashboardStyles as styles } from "@classes/styles";
import { LectureCardProps } from "@classes/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shared/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";
import { useLectureCard } from "../hooks/useLectureCard";

const LectureCard: React.FC<LectureCardProps> = ({
  lecture,
  index,
  handleViewAttendance,
  handleEditLecture,
  handleEndLecture,
}) => {
  const { colors, isDark } = useTheme();
  const {deleteLecture} = useLectureCard(lecture.id);
  return (
    <Animated.View
      key={lecture.id}
      entering={FadeInDown.delay(300 + index * 100).springify()}
      layout={LinearTransition.springify()}
    >
      <LinearGradient
        colors={
          isDark
            ? ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]
            : ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.5)"]
        }
        style={[
          styles.lectureCard,
          {
            borderColor:
              lecture.status === "active"
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
          {lecture.status === "active" ? (
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
            style={[
              styles.actionBtn,
              {
                backgroundColor: isDark
                  ? "rgba(59, 130, 246, 0.15)"
                  : "rgba(59, 130, 246, 0.1)",
              },
            ]}
            onPress={() => handleViewAttendance(lecture)}
          >
            <Text style={styles.actionBtnText}>View Attendance</Text>
            <Ionicons name="arrow-forward" size={16} color="#3B82F6" />
          </TouchableOpacity>

          <View style={styles.iconActions}>
            {lecture.status === "active" && (
              <>
                <TouchableOpacity
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
                onPress={() => deleteLecture(lecture)}
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
