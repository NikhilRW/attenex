import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { socketService } from "@/src/shared/services/socketService";
import { logger } from "@/src/shared/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { getPasscode } from "../services/lectureService";

const LectureEndedScreen = () => {
    const router = useRouter();
    const { colors, mode } = useTheme();
    const isDark = mode === "dark";
    const params = useLocalSearchParams();
    const { lectureId, lectureTitle } = params;

    const [passcode, setPasscode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Animation for passcode glow effect
    const glowOpacity = useSharedValue(0.3);

    useEffect(() => {
        glowOpacity.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
    }, []);

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const fetchPasscodeData = async () => {
        try {
            setLoading(true);
            const res = await getPasscode(lectureId as string);
            if (res.success) {
                setPasscode(res.data.passcode);
                setLastUpdated(new Date(res.data.updatedAt));
            }
        } catch (error: any) {
            logger.error("Failed to fetch passcode:", error);
            Alert.alert("Error", error.message || "Failed to fetch passcode");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPasscodeData();

        // Connect to socket and join lecture room
        socketService.connect();
        socketService.joinLecture(lectureId as string);

        // Listen for passcode refresh events
        socketService.onPasscodeRefresh((data) => {
            logger.info("Passcode refresh event received:", data);
            if (data.lectureId === lectureId) {
                setPasscode(data.passcode);
                setLastUpdated(new Date(data.updatedAt));
            }
        });

        // Cleanup on unmount
        return () => {
            socketService.leaveLecture(lectureId as string);
            socketService.offPasscodeRefresh();
        };
    }, [lectureId]);

    const handleCopyPasscode = () => {
        if (passcode) {
            // Note: In React Native, you'd need expo-clipboard
            Alert.alert("Copied!", `Passcode ${passcode} copied to clipboard`);
        }
    };

    const handleDone = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <FuturisticBackground />
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <View style={styles.contentContainer}>
                    {/* Header */}
                    <Animated.View
                        entering={FadeInDown.delay(100).springify()}
                        style={styles.header}
                    >
                        <TouchableOpacity onPress={handleDone} style={styles.backButton}>
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color={colors.text.primary}
                            />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                            Lecture Ended
                        </Text>
                        <View style={{ width: 40 }} />
                    </Animated.View>

                    {/* Success Icon */}
                    <Animated.View
                        entering={FadeInUp.delay(200).springify()}
                        style={styles.iconContainer}
                    >
                        <LinearGradient
                            colors={["#10B981", "#059669"]}
                            style={styles.successIcon}
                        >
                            <Ionicons name="checkmark-circle" size={80} color="white" />
                        </LinearGradient>
                    </Animated.View>

                    {/* Lecture Title */}
                    <Animated.View entering={FadeInDown.delay(300).springify()}>
                        <Text style={[styles.title, { color: colors.text.primary }]}>
                            {lectureTitle}
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                            Class has been ended successfully
                        </Text>
                    </Animated.View>

                    {/* Passcode Card */}
                    <Animated.View
                        entering={FadeInUp.delay(400).springify()}
                        style={styles.passcodeSection}
                    >
                        <LinearGradient
                            colors={["rgba(30, 30, 35, 0.8)", "rgba(10, 10, 12, 0.9)"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[
                                styles.passcodeCard,
                                {
                                    borderColor: "rgba(255, 255, 255, 0.1)",
                                    borderWidth: 1,
                                },
                            ]}
                        >
                            {/* Animated Glow Background */}
                            <Animated.View
                                style={[
                                    styles.glowBackground,
                                    {
                                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                                    },
                                    glowStyle,
                                ]}
                            />

                            <View style={[styles.passcodeHeader, { backgroundColor: "rgba(255, 255, 255, 0.05)" }]}>
                                <Ionicons name="lock-closed" size={20} color="#60A5FA" />
                                <Text style={[styles.passcodeLabel, { color: "#60A5FA" }]}>
                                    Share This Passcode
                                </Text>
                            </View>

                            {loading ? (
                                <ActivityIndicator size="large" color="#60A5FA" />
                            ) : passcode ? (
                                <>
                                    <View style={styles.passcodeDigits}>
                                        {passcode.split("").map((digit, idx) => (
                                            <LinearGradient
                                                key={idx}
                                                colors={["rgba(255, 255, 255, 0.08)", "rgba(0, 0, 0, 0.2)"]}
                                                style={[
                                                    styles.passcodeDigit,
                                                    {
                                                        borderColor: "rgba(255, 255, 255, 0.1)",
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.passcodeDigitText,
                                                        { color: "#FFFFFF" },
                                                    ]}
                                                >
                                                    {digit}
                                                </Text>
                                            </LinearGradient>
                                        ))}
                                    </View>

                                    <Text
                                        style={[styles.passcodeHint, { color: "rgba(255, 255, 255, 0.6)" }]}
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
                        </LinearGradient>

                        {/* Action Buttons */}
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[
                                    styles.refreshButton,
                                    {
                                        backgroundColor: isDark
                                            ? "rgba(59, 130, 246, 0.15)"
                                            : "rgba(59, 130, 246, 0.1)",
                                    },
                                ]}
                                onPress={fetchPasscodeData}
                                disabled={loading}
                            >
                                <Ionicons
                                    name="refresh"
                                    size={20}
                                    color="#3B82F6"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={[styles.refreshButtonText, { color: "#3B82F6" }]}>
                                    Refresh
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Instructions
          <Animated.View
            entering={FadeInDown.delay(500).springify()}
            style={[
              styles.instructionsCard,
              {
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
                borderColor: colors.surface.glassBorder,
              },
            ]}
          >
            <Text
              style={[styles.instructionsTitle, { color: colors.text.primary }]}
            >
              Next Steps:
            </Text>
            <View style={styles.instructionItem}>
              <View
                style={[
                  styles.instructionNumber,
                  { backgroundColor: colors.primary.main },
                ]}
              >
                <Text style={styles.instructionNumberText}>1</Text>
              </View>
              <Text
                style={[
                  styles.instructionText,
                  { color: colors.text.secondary },
                ]}
              >
                Share the passcode verbally with your students
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View
                style={[
                  styles.instructionNumber,
                  { backgroundColor: colors.primary.main },
                ]}
              >
                <Text style={styles.instructionNumberText}>2</Text>
              </View>
              <Text
                style={[
                  styles.instructionText,
                  { color: colors.text.secondary },
                ]}
              >
                Students will enter this code to verify their attendance
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View
                style={[
                  styles.instructionNumber,
                  { backgroundColor: colors.primary.main },
                ]}
              >
                <Text style={styles.instructionNumberText}>3</Text>
              </View>
              <Text
                style={[
                  styles.instructionText,
                  { color: colors.text.secondary },
                ]}
              >
                Wait for students to submit, then check attendance
              </Text>
            </View>
          </Animated.View> */}

                    {/* Done Button */}
                    <Animated.View
                        entering={FadeInUp.delay(600).springify()}
                        style={styles.doneButtonContainer}
                    >
                        <TouchableOpacity onPress={handleDone} activeOpacity={0.8}>
                            <LinearGradient
                                colors={[colors.primary.main, "#3B82F6"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.doneButton}
                            >
                                <Text style={styles.doneButtonText}>Done</Text>
                                <Ionicons name="checkmark" size={22} color="white" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 24,
        paddingTop: 20,
        paddingBottom: 70 + 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 40,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    iconContainer: {
        alignItems: "center",
        marginBottom: 32,
    },
    successIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 12,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 48,
        lineHeight: 24,
        opacity: 0.8,
    },
    passcodeSection: {
        marginBottom: 32,
    },
    passcodeCard: {
        borderRadius: 32,
        borderWidth: 1,
        padding: 32,
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        // elevation: 8,
    },
    glowBackground: {
        position: "absolute",
        top: -50,
        left: -50,
        right: -50,
        bottom: -50,
        borderRadius: 100,
    },
    passcodeHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 28,
        zIndex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    passcodeLabel: {
        fontSize: 14,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    passcodeDigits: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24,
        zIndex: 1,
    },
    passcodeDigit: {
        width: 60,
        height: 80,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    passcodeDigitText: {
        fontSize: 36,
        fontWeight: "800",
        letterSpacing: 2,
    },
    passcodeHint: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 8,
        zIndex: 1,
        opacity: 0.7,
    },
    updateTime: {
        fontSize: 12,
        fontStyle: "italic",
        zIndex: 1,
        opacity: 0.5,
    },
    errorText: {
        fontSize: 14,
        fontWeight: "600",
    },
    buttonGroup: {
        marginTop: 20,
        alignItems: "center",
    },
    refreshButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    refreshButtonText: {
        fontSize: 14,
        fontWeight: "600",
    },
    instructionsCard: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
        marginBottom: 24,
    },
    instructionsTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },
    instructionItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    instructionNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        marginTop: 2,
    },
    instructionNumberText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    instructionText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
    },
    doneButtonContainer: {
        marginTop: "auto",
        marginBottom: 20,
    },
    doneButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
        borderRadius: 20,
        gap: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    doneButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
});

export default LectureEndedScreen;
