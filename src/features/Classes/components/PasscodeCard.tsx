import { lectureEndedStyles as styles } from "@classes/styles";
import { PasscodeCardProps } from "@classes/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shared/hooks";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export const PasscodeCard: React.FC<PasscodeCardProps> = ({ passcode, loading, onRefresh }) => {
    const { colors, isDark } = useTheme();

    return (
        <Animated.View
            entering={FadeInUp.delay(400).springify()}
            style={styles.passcodeSection}
        >
            <LinearGradient
                colors={
                    isDark
                        ? ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]
                        : ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.5)"]
                }
                style={[
                    styles.passcodeCard,
                    {
                        borderColor: colors.surface.glassBorder,
                        borderWidth: 1,
                    },
                ]}
            >
                <View
                    style={[
                        styles.passcodeHeader,
                        { backgroundColor: colors.surface.glass },
                    ]}
                >
                    <Ionicons
                        name="lock-closed"
                        size={20}
                        color={colors.primary.main}
                    />
                    <Text
                        style={[styles.passcodeLabel, { color: colors.primary.main }]}
                    >
                        Share This Passcode
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary.main} />
                ) : passcode ? (
                    <>
                        <View style={styles.passcodeDigits}>
                            {passcode.split("").map((digit, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        styles.passcodeDigit,
                                        {
                                            backgroundColor: isDark
                                                ? "rgba(28, 84, 114, 0.2)"
                                                : "rgba(255,255,255,0.5)",
                                            borderColor: colors.surface.glassBorder,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.passcodeDigitText,
                                            { color: colors.text.primary },
                                        ]}
                                    >
                                        {digit}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text
                            style={[
                                styles.passcodeHint,
                                { color: colors.text.secondary },
                            ]}
                        >
                            Students need this code to verify attendance
                        </Text>
                    </>
                ) : (
                    <Text
                        style={[styles.errorText, { color: colors.status.error }]}
                    >
                        Failed to load passcode
                    </Text>
                )}

                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={[
                            styles.refreshButton,
                            {
                                backgroundColor: colors.primary.glow,
                            },
                        ]}
                        onPress={onRefresh}
                        disabled={loading}
                    >
                        <Ionicons
                            name="refresh"
                            size={20}
                            color={colors.primary.main}
                            style={{ marginRight: 8 }}
                        />
                        <Text
                            style={[
                                styles.refreshButtonText,
                                { color: colors.primary.main },
                            ]}
                        >
                            Refresh
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};
