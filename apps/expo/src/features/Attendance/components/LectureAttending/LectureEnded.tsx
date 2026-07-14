import React from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { withUnistyles } from "react-native-unistyles";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import styles from "@attendance/styles/StudentDashboard.styles";
import { LectureEndedProps } from "@attendance/types/props";

const PrimaryGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: [theme.primary.main, theme.accent.blue] as const,
}));

const UniTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.muted,
}));

const PrimaryTextIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.primary,
}));

const PrimaryTextSpinner = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.text.primary,
}));

const LectureEnded = ({
  joinedLecture,
  handleSubmit,
  loading,
  passcode,
  setPasscode,
}: LectureEndedProps) => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.joinedContainer}>
        <View style={styles.guardianIconOuter}>
          <PrimaryGradient style={styles.guardianIconInner}>
            <PrimaryTextIcon name="checkmark-done-circle" size={48} />
          </PrimaryGradient>
        </View>

        <Text style={styles.guardianTitle}>Lecture Ended</Text>
        <Text style={styles.guardianSubtitle}>
          {joinedLecture?.subject ? (
            <>
              <Text style={styles.lectureTitleHighlight}>{joinedLecture.subject} Lecture</Text> has
              finished!
              {"\n"}
            </>
          ) : (
            "Class finished!\n"
          )}
          Verify your attendance now using the passcode from your teacher.
        </Text>

        <View style={styles.passcodeCard}>
          <Text style={styles.passcodeLabel}>Enter Passcode to Verify</Text>
          <UniTextInput
            style={styles.passcodeInput}
            placeholder="Enter 4-digit Passcode"
            value={passcode}
            onChangeText={setPasscode}
            keyboardType="numeric"
            maxLength={4}
            testID="LECTURE_ENDED.PASSCODE_INPUT"
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            haptic="impact"
            testID="LECTURE_ENDED.VERIFY_BUTTON"
          >
            <PrimaryGradient style={styles.submitButton}>
              {loading ? (
                <PrimaryTextSpinner />
              ) : (
                <Text style={styles.submitButtonText}>Verify Attendance</Text>
              )}
            </PrimaryGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LectureEnded;
