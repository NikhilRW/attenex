import { getStudentLectures } from "@/src/features/Classes/services/lectureService";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { authService } from "@/src/shared/services/authService";
import { useAuthStore } from "@/src/shared/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { joinLecture, submitAttendance } from "../services/attendanceService";
import { startBackgroundTracking, stopBackgroundTracking } from "../services/backgroundTask";

const StudentDashboard = () => {
    const { colors, mode } = useTheme();
    const isDark = mode === "dark";
    const { user } = useAuthStore();
    const [lectures, setLectures] = useState<any[]>([]);
    const [joinedLecture, setJoinedLecture] = useState<any | null>(null);
    const [passcode, setPasscode] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "joined" | "submitting">("idle");
    const [showClassModal, setShowClassModal] = useState(false);
    const [className, setClassName] = useState("");
    const [classUpdateLoading, setClassUpdateLoading] = useState(false);
    const [showRollNoModal, setShowRollNoModal] = useState(false);
    const [rollNo, setRollNo] = useState("");
    const [pendingLecture, setPendingLecture] = useState<any | null>(null);

    const fetchLectures = useCallback(async () => {
        try {
            const res = await getStudentLectures();
            if (res.success) {
                setLectures(res.data);
            }
        } catch (error) {
            console.log("Error fetching lectures", error);
        }
    }, []);

    useEffect(() => {
        fetchLectures();
    }, [fetchLectures]);

    const handleUpdateClass = async () => {
        if (!className.trim()) {
            Alert.alert("Error", "Please enter a class name");
            return;
        }

        setClassUpdateLoading(true);
        try {
            const response = await authService.updateStudentClass(className.trim());
            if (response.success) {
                Alert.alert("Success", "Class updated successfully!");
                setShowClassModal(false);
                setClassName("");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to update class");
        } finally {
            setClassUpdateLoading(false);
        }
    };

    const handleJoin = async (lecture: any) => {
        // Check if user has a roll number set
        if (!user?.rollNo) {
            setPendingLecture(lecture);
            setShowRollNoModal(true);
            return;
        }

        await proceedWithJoin(lecture, user.rollNo);
    };

    const proceedWithJoin = async (lecture: any, studentRollNo: string) => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission denied", "Location is required to join class.");
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});

            const res = await joinLecture(
                lecture.id,
                location.coords.latitude,
                location.coords.longitude,
                studentRollNo
            );

            if (res.success) {
                setJoinedLecture(lecture);
                setStatus("joined");
                Alert.alert("Joined!", "Class in progress. You can lock your phone now.");
                // Start Background Task
                await startBackgroundTracking(lecture.id);
            }
        } catch (error: any) {
            console.log(error);
            Alert.alert("Join Failed", error.message || "Could not join class");
        } finally {
            setLoading(false);
        }
    };

    const handleRollNoSubmit = async () => {
        if (!rollNo.trim()) {
            Alert.alert("Error", "Please enter your roll number");
            return;
        }

        setShowRollNoModal(false);
        if (pendingLecture) {
            await proceedWithJoin(pendingLecture, rollNo.trim());
            setPendingLecture(null);
            setRollNo("");
        }
    };

    const handleSubmit = async () => {
        if (!passcode || passcode.length !== 4) {
            Alert.alert("Invalid Passcode", "Please enter the 4-digit passcode.");
            return;
        }

        setLoading(true);
        try {
            let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});

            const res = await submitAttendance(
                joinedLecture.id,
                passcode,
                location.coords.latitude,
                location.coords.longitude
            );

            if (res.success) {
                Alert.alert("Success", "Attendance Marked Present! ✅");
                setJoinedLecture(null);
                setStatus("idle");
                setPasscode("");
                await stopBackgroundTracking();
                fetchLectures();
            }
        } catch (error: any) {
            Alert.alert("Submission Failed", error.message || "Could not mark attendance");
        } finally {
            setLoading(false);
        }
    };

    if (status === "joined") {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
                <LinearGradient
                    colors={isDark ? ["rgba(20, 20, 20, 0.8)", "rgba(40, 40, 40, 0.8)"] : ["rgba(255, 255, 255, 0.8)", "rgba(240, 240, 255, 0.8)"]}
                    style={styles.joinedContainer}
                >
                    <View style={styles.guardianIconOuter}>
                        <LinearGradient
                            colors={[colors.accent.green, "#4CAF50"]}
                            style={styles.guardianIconInner}
                        >
                            <Ionicons name="shield-checkmark" size={48} color="white" />
                        </LinearGradient>
                    </View>

                    <Text style={[styles.guardianTitle, { color: colors.text.primary }]}>
                        Silent Guardian Active
                    </Text>
                    <Text style={[styles.guardianSubtitle, { color: colors.text.secondary }]}>
                        You are currently attending {joinedLecture?.title}.{"\n"}
                        Do not force quit the app.
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
                        <Text style={[styles.passcodeLabel, { color: colors.text.secondary }]}>
                            End of Class?
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
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={[colors.accent.green, "#43A047"]}
                                style={styles.submitButton}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Submit Attendance</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background.secondary }]}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.headerSection}>
                <Text style={[styles.title, { color: colors.text.primary }]}>
                    Student Dashboard
                </Text>

                {/* Class Info Card */}
                <LinearGradient
                    colors={
                        isDark
                            ? ["rgba(8, 145, 178, 0.15)", "rgba(8, 145, 178, 0.05)"]
                            : ["rgba(8, 145, 178, 0.1)", "rgba(8, 145, 178, 0.05)"]
                    }
                    style={[
                        styles.classInfoCard,
                        { borderColor: colors.surface.glassBorder },
                    ]}
                >
                    <View style={styles.classInfoHeader}>
                        <View style={styles.classInfoLeft}>
                            <Ionicons
                                name="school"
                                size={24}
                                color={colors.primary.main}
                                style={{ marginRight: 12 }}
                            />
                            <View>
                                <Text
                                    style={[
                                        styles.classInfoLabel,
                                        { color: colors.text.secondary },
                                    ]}
                                >
                                    Your Class
                                </Text>
                                <Text
                                    style={[
                                        styles.classInfoValue,
                                        { color: colors.text.primary },
                                    ]}
                                >
                                    {user?.classId ? (user as any).className || "Not Set" : "Not Set"}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => setShowClassModal(true)}
                            style={[
                                styles.editClassButton,
                                {
                                    backgroundColor: isDark
                                        ? "rgba(255, 255, 255, 0.1)"
                                        : "rgba(0, 0, 0, 0.05)",
                                },
                            ]}
                        >
                            <Ionicons
                                name="pencil"
                                size={18}
                                color={colors.primary.main}
                            />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Available Classes
            </Text>

            {lectures.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="school-outline" size={64} color={colors.text.muted} />
                    <Text style={[styles.emptyText, { color: colors.text.muted }]}>
                        No active lectures found.
                    </Text>
                    <TouchableOpacity onPress={fetchLectures} style={styles.refreshButton}>
                        <Text style={[styles.refreshText, { color: colors.primary.main }]}>
                            Refresh List
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                lectures.map((lecture) => (
                    <LinearGradient
                        key={lecture.id}
                        colors={isDark ? ["rgba(30, 30, 30, 0.9)", "rgba(20, 20, 20, 0.95)"] : ["rgba(255, 255, 255, 0.95)", "rgba(245, 247, 250, 0.95)"]}
                        style={[
                            styles.lectureCard,
                            {
                                borderColor: colors.surface.glassBorder,
                            },
                        ]}
                    >
                        <View style={styles.lectureCardHeader}>
                            <View style={styles.lectureInfo}>
                                <Text style={[styles.lectureCardTitle, { color: colors.text.primary }]}>
                                    {lecture.title}
                                </Text>
                                <Text style={[styles.lectureClassName, { color: colors.text.secondary }]}>
                                    {lecture.className}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.liveBadge,
                                    { backgroundColor: "rgba(76, 175, 80, 0.15)" },
                                ]}
                            >
                                <View style={[styles.liveDot, { backgroundColor: colors.accent.green }]} />
                                <Text style={[styles.liveBadgeText, { color: colors.accent.green }]}>
                                    LIVE
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => handleJoin(lecture)}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={[colors.primary.main, "#4c669f"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.joinButton}
                            >
                                <Text style={styles.joinButtonText}>Join Class</Text>
                                {loading ? (
                                    <ActivityIndicator size="small" color="white" style={styles.joinButtonLoader} />
                                ) : (
                                    <Ionicons name="arrow-forward" size={20} color="white" style={styles.joinButtonIcon} />
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>
                ))
            )}

            {/* Class Update Modal */}
            <Modal
                visible={showClassModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowClassModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <LinearGradient
                        colors={
                            isDark
                                ? ["rgba(30, 30, 30, 0.98)", "rgba(20, 20, 20, 0.98)"]
                                : ["rgba(255, 255, 255, 0.98)", "rgba(245, 245, 245, 0.98)"]
                        }
                        style={[
                            styles.modalContent,
                            { borderColor: colors.surface.glassBorder },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text
                                style={[styles.modalTitle, { color: colors.text.primary }]}
                            >
                                Update Class
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowClassModal(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={colors.text.primary}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text
                                style={[
                                    styles.modalLabel,
                                    { color: colors.text.secondary },
                                ]}
                            >
                                Enter your class name
                            </Text>
                            <TextInput
                                style={[
                                    styles.modalInput,
                                    {
                                        color: colors.text.primary,
                                        backgroundColor: isDark
                                            ? "rgba(255, 255, 255, 0.05)"
                                            : "rgba(0, 0, 0, 0.03)",
                                        borderColor: colors.surface.glassBorder,
                                    },
                                ]}
                                value={className}
                                onChangeText={setClassName}
                                placeholder="e.g., Computer Science 101"
                                placeholderTextColor={colors.text.muted}
                            />
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    {
                                        backgroundColor: isDark
                                            ? "rgba(255, 255, 255, 0.1)"
                                            : "rgba(0, 0, 0, 0.05)",
                                    },
                                ]}
                                onPress={() => setShowClassModal(false)}
                            >
                                <Text
                                    style={[
                                        styles.modalButtonText,
                                        { color: colors.text.primary },
                                    ]}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    { backgroundColor: colors.primary.main },
                                ]}
                                onPress={handleUpdateClass}
                                disabled={classUpdateLoading}
                            >
                                {classUpdateLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text
                                        style={[styles.modalButtonText, { color: "white" }]}
                                    >
                                        Update
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
            </Modal>

            {/* Roll Number Modal */}
            <Modal
                visible={showRollNoModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowRollNoModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <LinearGradient
                        colors={
                            isDark
                                ? ["rgba(30, 30, 30, 0.95)", "rgba(20, 20, 20, 0.98)"]
                                : ["rgba(255, 255, 255, 0.95)", "rgba(240, 240, 240, 0.98)"]
                        }
                        style={[
                            styles.modalContent,
                            { borderColor: colors.surface.glassBorder },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text
                                style={[styles.modalTitle, { color: colors.text.primary }]}
                            >
                                Enter Roll Number
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowRollNoModal(false);
                                    setPendingLecture(null);
                                    setRollNo("");
                                }}
                                style={styles.closeButton}
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={colors.text.primary}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text
                                style={[
                                    styles.modalLabel,
                                    { color: colors.text.secondary },
                                ]}
                            >
                                Please enter your roll number to continue
                            </Text>
                            <TextInput
                                style={[
                                    styles.modalInput,
                                    {
                                        color: colors.text.primary,
                                        backgroundColor: isDark
                                            ? "rgba(255, 255, 255, 0.05)"
                                            : "rgba(0, 0, 0, 0.03)",
                                        borderColor: colors.surface.glassBorder,
                                    },
                                ]}
                                value={rollNo}
                                onChangeText={setRollNo}
                                placeholder="e.g., 2021001"
                                placeholderTextColor={colors.text.muted}
                                keyboardType="default"
                                autoCapitalize="characters"
                            />
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    {
                                        backgroundColor: isDark
                                            ? "rgba(255, 255, 255, 0.1)"
                                            : "rgba(0, 0, 0, 0.05)",
                                    },
                                ]}
                                onPress={() => {
                                    setShowRollNoModal(false);
                                    setPendingLecture(null);
                                    setRollNo("");
                                }}
                            >
                                <Text
                                    style={[
                                        styles.modalButtonText,
                                        { color: colors.text.primary },
                                    ]}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    { backgroundColor: colors.primary.main },
                                ]}
                                onPress={handleRollNoSubmit}
                            >
                                <Text
                                    style={[styles.modalButtonText, { color: "white" }]}
                                >
                                    Submit
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
    },
    headerSection: {
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    classInfoCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 8,
    },
    classInfoHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    classInfoLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    classInfoLabel: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    classInfoValue: {
        fontSize: 18,
        fontWeight: "700",
    },
    editClassButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 24,
        opacity: 0.8,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        opacity: 0.7,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 16,
        textAlign: "center",
    },
    refreshButton: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    refreshText: {
        fontSize: 16,
        fontWeight: "600",
    },
    lectureCard: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    lectureCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    lectureInfo: {
        flex: 1,
        marginRight: 12,
    },
    lectureCardTitle: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    lectureClassName: {
        fontSize: 16,
        fontWeight: "500",
        opacity: 0.8,
    },
    liveBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    liveBadgeText: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    joinButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    joinButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
        marginRight: 8,
    },
    joinButtonIcon: {
        marginLeft: 4,
    },
    joinButtonLoader: {
        marginLeft: 8,
    },
    // Joined State Styles
    joinedContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    guardianIconOuter: {
        marginBottom: 32,
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    guardianIconInner: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 4,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    guardianTitle: {
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 12,
        textAlign: "center",
        letterSpacing: -0.5,
    },
    guardianSubtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 48,
        lineHeight: 24,
        opacity: 0.8,
    },
    passcodeCard: {
        width: "100%",
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    passcodeLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 12,
        textTransform: "uppercase",
        letterSpacing: 1,
        opacity: 0.7,
    },
    passcodeInput: {
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 20,
        letterSpacing: 4,
    },
    submitButton: {
        height: 56,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        width: "100%",
        maxWidth: 400,
        borderRadius: 24,
        borderWidth: 1,
        overflow: "hidden",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    modalBody: {
        padding: 20,
    },
    modalLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    modalInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
    },
    modalFooter: {
        flexDirection: "row",
        gap: 12,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.1)",
    },
    modalButton: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
});

export default StudentDashboard;
