import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import Lucide from "@react-native-vector-icons/lucide";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

import { TouchableOpacity } from "@shared/components/TouchableOpacity";

import { STUDENT_CARD_ANIMATION_DURATION } from "../constants/common";
import { styles } from "../styles/StudentAnalyticsScreen.styles";
import { StudentAttendanceCardProps } from "../types/props";
import { formatStudentAnalyticsDate, formatStudentAnalyticsTime } from "../utils/common";

const MetaIcon = withUnistyles(Ionicons, (theme) => ({ color: theme.text.muted }));
const ChevronIcon = withUnistyles(Ionicons, (theme) => ({ color: theme.text.secondary }));
const AttendedIcon = withUnistyles(Lucide, (theme) => ({ color: theme.status.success }));
const MissedIcon = withUnistyles(Lucide, (theme) => ({ color: theme.status.error }));

export const StudentAttendanceCard = ({ lecture }: StudentAttendanceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAttended = lecture.status === "attended";
  const { formattedDate, formattedTime } = useMemo(
    () => ({
      formattedDate: formatStudentAnalyticsDate(lecture.startedAt),
      formattedTime: formatStudentAnalyticsTime(lecture.startedAt),
    }),
    [lecture.startedAt],
  );

  return (
    <Animated.View
      layout={LinearTransition.duration(STUDENT_CARD_ANIMATION_DURATION.layout)}
      style={styles.lectureCard}
    >
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setIsExpanded((expanded) => !expanded)}
        haptic="selection"
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`${lecture.subjectName}, ${isAttended ? "attended" : "missed"}`}
      >
        <View style={styles.titleContent}>
          <Text style={styles.subjectName} numberOfLines={1}>
            {lecture.subjectName}
          </Text>
          <View style={styles.compactDateRow}>
            <MetaIcon name="calendar-outline" size={14} />
            <Text style={styles.teacherName}>{formattedDate}</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          {isAttended ? (
            <AttendedIcon name="user-round-check" size={20} />
          ) : (
            <MissedIcon name="user-round-x" size={20} />
          )}
          <ChevronIcon name={isExpanded ? "chevron-up" : "chevron-down"} size={18} />
        </View>
      </TouchableOpacity>

      {isExpanded ? (
        <Animated.View
          entering={FadeIn.duration(STUDENT_CARD_ANIMATION_DURATION.enter)}
          exiting={FadeOut.duration(STUDENT_CARD_ANIMATION_DURATION.exit)}
          style={styles.detailsContainer}
        >
          <View style={styles.metadataItem}>
            <MetaIcon name="person-outline" size={16} />
            <Text style={styles.metadataText} numberOfLines={1}>
              {lecture.teacherName}
            </Text>
          </View>
          <View style={styles.metadataItem}>
            <MetaIcon name="time-outline" size={16} />
            <Text style={styles.metadataText}>{formattedTime}</Text>
          </View>
          <View style={styles.metadataItem}>
            <MetaIcon name="hourglass-outline" size={16} />
            <Text style={styles.metadataText}>{lecture.duration} minutes</Text>
          </View>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
};
