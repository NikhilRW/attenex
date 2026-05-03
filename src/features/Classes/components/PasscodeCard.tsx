import { styles } from "@classes/styles/LectureEndedScreen.styles";
import { PasscodeCardProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const PasscodeSurface = withUnistyles(LinearGradient, (_, rt) => ({
  colors:
    rt.themeName === "dark"
      ? (["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"] as const)
      : (["rgba(255,255,255,0.9)", "rgba(255,255,255,0.5)"] as const),
}));

const LockIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const RefreshIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const LoadingIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.primary.main,
}));

export const PasscodeCard: React.FC<PasscodeCardProps> = ({
  passcode,
  loading,
  onRefresh,
}) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(400).springify()}
      style={styles.passcodeSection}
    >
      <PasscodeSurface style={styles.passcodeCard}>
        <View style={styles.passcodeHeader}>
          <LockIcon name="lock-closed" size={20} />
          <Text style={styles.passcodeLabel}>Share This Passcode</Text>
        </View>

        {loading ? (
          <LoadingIndicator size="large" />
        ) : passcode ? (
          <>
            <View style={styles.passcodeDigits}>
              {passcode.split("").map((digit) => (
                <View
                  key={`passcode-${digit}`}
                  style={styles.passcodeDigit}
                >
                  <Text style={styles.passcodeDigitText}>{digit}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.passcodeHint}>
              Students need this code to verify attendance
            </Text>
          </>
        ) : (
          <Text style={styles.errorText}>Failed to load passcode</Text>
        )}

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={onRefresh}
            disabled={loading}
          >
            <RefreshIcon name="refresh" size={20} style={styles.refreshIcon} />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </PasscodeSurface>
    </Animated.View>
  );
};
