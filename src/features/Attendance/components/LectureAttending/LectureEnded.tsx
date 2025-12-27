import { styles } from "@attendance/styles";
import { LectureEndedProps } from "@attendance/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shared/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LectureEnded = ({
  joinedLecture,
  handleSubmit,
  loading,
  passcode,
  setPasscode,
}: LectureEndedProps) => {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
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
            colors={[colors.primary.main, "#3B82F6"]}
            style={styles.guardianIconInner}
          >
            <Ionicons name="checkmark-done-circle" size={48} color="white" />
          </LinearGradient>
        </View>

        <Text style={[styles.guardianTitle, { color: colors.text.primary }]}>
          Lecture Ended
        </Text>
        <Text
          style={[styles.guardianSubtitle, { color: colors.text.secondary }]}
        >
          {joinedLecture?.title ? (
            <>
              <Text style={{ fontWeight: "700", color: colors.primary.main }}>
                {joinedLecture.title}
              </Text>{" "}
              has finished!
              {"\n"}
            </>
          ) : (
            "Class finished!\n"
          )}
          Verify your attendance now using the passcode from your teacher.
        </Text>

        <View
          style={[
            styles.passcodeCard,
            {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(255, 255, 255, 0.6)",
              borderColor: colors.surface.glassBorder,
            },
          ]}
        >
          <Text
            style={[styles.passcodeLabel, { color: colors.text.secondary }]}
          >
            Enter Passcode to Verify
          </Text>
          <TextInput
            style={[
              styles.passcodeInput,
              {
                backgroundColor: isDark
                  ? "rgba(0, 0, 0, 0.3)"
                  : "rgba(255, 255, 255, 0.5)",
                color: colors.text.primary,
                borderColor: colors.surface.glassBorder,
              },
            ]}
            placeholder="Enter 4-digit Passcode"
            placeholderTextColor={colors.text.muted}
            value={passcode}
            onChangeText={setPasscode}
            keyboardType="numeric"
            maxLength={4}
          />
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            <LinearGradient
              colors={[colors.primary.main, "#3B82F6"]}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Verify Attendance</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LectureEnded;
