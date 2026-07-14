import React from "react";
import { Text, View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

import { styles } from "@classes/styles/AttendanceViewScreen.styles";
import { StudentCardProps } from "@classes/types/props";

const PresentAvatar = withUnistyles(LinearGradient, () => ({
  colors: ["rgba(74, 222, 128, 0.2)", "rgba(74, 222, 128, 0.1)"] as const,
}));

const IncompleteAvatar = withUnistyles(LinearGradient, () => ({
  colors: ["rgba(251, 191, 36, 0.2)", "rgba(251, 191, 36, 0.1)"] as const,
}));

const AbsentAvatar = withUnistyles(LinearGradient, () => ({
  colors: ["rgba(248, 113, 113, 0.2)", "rgba(248, 113, 113, 0.1)"] as const,
}));

const MetaIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const StudentCard: React.FC<StudentCardProps> = ({ record, index }) => {
  const AvatarGradient =
    record.status === "present"
      ? PresentAvatar
      : record.status === "incomplete"
        ? IncompleteAvatar
        : AbsentAvatar;

  return (
    <Animated.View
      entering={FadeInDown.delay(300 + index * 50).springify()}
      layout={LinearTransition.springify()}
      style={[
        styles.studentCard,
        record.status === "present"
          ? styles.studentCardPresent
          : record.status === "incomplete"
            ? styles.studentCardIncomplete
            : styles.studentCardAbsent,
      ]}
    >
      <View style={styles.cardContent}>
        {/* Avatar */}
        <AvatarGradient style={styles.avatar}>
          <Text
            style={[
              styles.avatarText,
              record.status === "present"
                ? styles.avatarTextPresent
                : record.status === "incomplete"
                  ? styles.avatarTextIncomplete
                  : styles.avatarTextAbsent,
            ]}
          >
            {getInitials(record.studentName)}
          </Text>
        </AvatarGradient>

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.studentName} ellipsizeMode="tail" numberOfLines={1}>
              {record.studentName.length > 20
                ? record.studentName.substr(0, 20) + "..."
                : record.studentName}
            </Text>
          </View>

          <Text style={styles.rollNo}>{record.studentRollNo || "No Roll No"}</Text>

          <View style={styles.metaRow}>
            {record.joinTime ? (
              <>
                <View style={styles.metaItem}>
                  <MetaIcon name="time-outline" size={12} />
                  <Text style={styles.metaText}>
                    {new Date(record.joinTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                <View style={styles.metaDot} />
                <View style={styles.metaItem}>
                  <MetaIcon
                    name={record.method === "manual" ? "hand-left-outline" : "location-outline"}
                    size={12}
                  />
                  <Text style={styles.metaText}>{record.method}</Text>
                </View>
              </>
            ) : (
              <View style={styles.metaItem}>
                <MetaIcon name="close-circle-outline" size={12} />
                <Text style={styles.metaText}>Did not attend</Text>
              </View>
            )}
          </View>
        </View>

        {/* Roll Number/Status */}
        <View style={styles.statusContainer}>
          {record.status === "present" ? (
            <View
              style={styles.rollBadge}
              testID={`STUDENT_CARD.STATUS_${record.studentRollNo || record.studentId}`}
            >
              <Text style={styles.rollText}>{record.studentRollNo || "N/A"}</Text>
            </View>
          ) : record.status === "incomplete" ? (
            <View
              style={[styles.absentBadge, styles.absentBadgeIncomplete]}
              testID={`STUDENT_CARD.STATUS_${record.studentRollNo || record.studentId}`}
            >
              <Text style={[styles.absentText, styles.absentTextIncomplete]}>INC</Text>
            </View>
          ) : (
            <View
              style={[styles.absentBadge, styles.absentBadgeAbsent]}
              testID={`STUDENT_CARD.STATUS_${record.studentRollNo || record.studentId}`}
            >
              <Text style={[styles.absentText, styles.absentTextAbsent]}>ABS</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export const MemoizedStudentCard = React.memo(StudentCard);
