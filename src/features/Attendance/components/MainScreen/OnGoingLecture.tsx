import { styles } from "@attendance/styles";
import { OnGoingLectureProps } from "@attendance/types/props";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shared/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const OnGoingLecture = ({
  lecture,
  loading,
  handleJoin,
}: OnGoingLectureProps) => {
  const { isDark, colors } = useTheme();
  return (
    <LinearGradient
      key={lecture.id}
      colors={
        isDark
          ? ["rgba(8, 145, 178, 0.15)", "rgba(8, 145, 178, 0.3)"]
          : ["rgba(8, 145, 178, 0.1)", "rgba(8, 145, 178, 0.3)"]
      }
      style={[
        styles.lectureCard,
        {
          borderColor: colors.surface.glassBorder,
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.lectureCardHeader}>
        <View style={styles.headerLeftContent}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isDark
                  ? "rgba(255 255 255 / 0.12)"
                  : "rgba(0,0,0,0.04)",
              },
            ]}
          >
            <Ionicons name="easel" size={22} color={colors.primary.main} />
          </View>
          <View style={styles.lectureInfo}>
            <Text
              style={[styles.lectureCardTitle, { color: colors.text.primary }]}
              numberOfLines={1}
            >
              {lecture.title}
            </Text>
            <View style={styles.lectureMetaRow}>
              <Ionicons
                name="school-outline"
                size={12}
                color={colors.text.secondary}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.lectureClassName,
                  { color: colors.text.secondary },
                ]}
              >
                {lecture!.className}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.liveBadge,
            {
              backgroundColor: isDark
                ? "rgba(76, 175, 80, 0.2)"
                : "rgba(76, 175, 80, 0.1)",
              borderColor: "rgba(76, 175, 80, 0.3)",
              borderWidth: 1,
            },
          ]}
        >
          <View
            style={[styles.liveDot, { backgroundColor: colors.accent.green }]}
          />
          <Text style={[styles.liveBadgeText, { color: colors.accent.green }]}>
            LIVE
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: colors.surface.glassBorder },
        ]}
      />

      <TouchableOpacity
        onPress={async () => await handleJoin(lecture)}
        disabled={loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.primary.main, "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.joinButton}
        >
          <Text style={styles.joinButtonText}>Join Class Now</Text>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="white"
              style={styles.joinButtonLoader}
            />
          ) : (
            <View style={styles.joinIconContainer}>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default OnGoingLecture;
