import { useTheme } from "@/src/shared/hooks/useTheme";
import { socketService } from "@/src/shared/services/socketService";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    AppState,
    Clipboard,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp, Layout } from "react-native-reanimated";
import { addManualAttendance, fetchLectureAttendance } from "../services/lectureService";

interface AttendanceRecord {
    id: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    studentRollNo: string | null;
    status: "present" | "absent" | "incomplete";
    joinTime: string | null;
    submitTime: string | null;
    checkScore: number;
    method: "manual" | "auto" | "oauth";
}

type FilterType = "all" | "present" | "absent" | "incomplete";

const { width } = Dimensions.get("window");

const AttendanceViewScreen = () => {
    const router = useRouter();
    const { colors, mode } = useTheme();
    const isDark = mode === "dark";
    const params = useLocalSearchParams();
    const lectureId = params.lectureId as string;
    const lectureTitle = params.lectureTitle as string;

    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showRollSummary, setShowRollSummary] = useState(false);
    const [showManualAttendance, setShowManualAttendance] = useState(false);
    const [manualRollNo, setManualRollNo] = useState("");
    const [isSubmittingManual, setIsSubmittingManual] = useState(false);

    const fetchAttendance = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetchLectureAttendance(lectureId);
            if (res.success) {
                setAttendance(res.data.attendance);
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to fetch attendance");
        } finally {
            setLoading(false);
        }
    }, [lectureId]);

    // Separate ref to avoid stale closures in socket callbacks
    const fetchAttendanceRef = React.useRef(fetchAttendance);
    React.useEffect(() => {
        fetchAttendanceRef.current = fetchAttendance;
    }, [fetchAttendance]);

    useEffect(() => {
        fetchAttendance();

        // Connect to socket and join lecture room for real-time updates
        socketService.connect();
        socketService.joinLecture(lectureId);

        // Listen for student joined events (when they first enter the lecture)
        const handleStudentJoined = (data: any) => {
            console.log('Student joined event received:', data);
            if (data.lectureId === lectureId) {
                // Refresh attendance list when someone joins
                fetchAttendanceRef.current();
            }
        };

        // Listen for attendance submission events (when they submit final attendance)
        const handleAttendanceSubmitted = (data: any) => {
            console.log('Attendance submitted event received:', data);
            if (data.lectureId === lectureId) {
                // Refresh attendance list when someone submits
                fetchAttendanceRef.current();
            }
        };

        socketService.onStudentJoined(handleStudentJoined);
        socketService.onAttendanceSubmitted(handleAttendanceSubmitted);

        // Handle app state changes (background/foreground)
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState === "active") {
                // App came back to foreground - reconnect socket and refresh data
                if (!socketService.isConnected()) {
                    socketService.connect();
                    socketService.joinLecture(lectureId);
                    socketService.onStudentJoined(handleStudentJoined);
                    socketService.onAttendanceSubmitted(handleAttendanceSubmitted);
                }
                fetchAttendanceRef.current();
            }
        });

        // Cleanup on unmount
        return () => {
            socketService.leaveLecture(lectureId);
            socketService.offStudentJoined();
            socketService.offAttendanceSubmitted();
            subscription.remove();
        };
    }, [lectureId]);

    // Also use useFocusEffect to ensure connection when screen regains focus
    useFocusEffect(
        useCallback(() => {
            // Refresh data when screen is focused
            fetchAttendanceRef.current();

            // Reconnect socket when screen is focused if disconnected
            if (!socketService.isConnected()) {
                socketService.connect();
                socketService.joinLecture(lectureId);
            }

            return () => {
                // Don't disconnect on blur, just on unmount
            };
        }, [lectureId])
    );

    const filteredAttendance = attendance.filter((record) => {
        const matchesFilter =
            filter === "all"
                ? true
                : filter === "present"
                    ? record.status === "present"
                    : filter === "incomplete"
                        ? record.status === "incomplete"
                        : record.status === "absent";

        const matchesSearch =
            record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (record.studentRollNo &&
                record.studentRollNo.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFilter && matchesSearch;
    });

    const presentCount = attendance.filter((r) => r.status === "present").length;
    const incompleteCount = attendance.filter((r) => r.status === "incomplete").length;
    const absentCount = attendance.filter((r) => r.status === "absent").length;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "present":
                return "#4ADE80"; // Brighter green
            case "absent":
                return "#F87171"; // Brighter red
            case "incomplete":
                return "#FBBF24"; // Brighter amber
            default:
                return colors.text.muted;
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getPresentRollNumbers = () => {
        return attendance
            .filter((r) => r.status === "present")
            .map((r) => r.studentRollNo)
            .filter((roll) => roll !== null && roll !== "")
            .sort((a, b) => {
                // Sort numerically if possible, otherwise alphabetically
                const numA = parseInt(a!);
                const numB = parseInt(b!);
                if (!isNaN(numA) && !isNaN(numB)) {
                    return numA - numB;
                }
                return a!.localeCompare(b!);
            })
            .join(", ");
    };

    const handleCopyRollNumbers = () => {
        const rollNumbers = getPresentRollNumbers();
        if (rollNumbers) {
            Clipboard.setString(rollNumbers);
            Alert.alert("Copied!", "Roll numbers copied to clipboard");
        } else {
            Alert.alert("No Data", "No present students with roll numbers");
        }
    };

    const handleManualAttendance = async () => {
        if (!manualRollNo.trim()) {
            Alert.alert("Error", "Please enter student roll number");
            return;
        }

        try {
            setIsSubmittingManual(true);
            const res = await addManualAttendance(lectureId, manualRollNo.trim());
            if (res.success) {
                Alert.alert("Success", res.message);
                setManualRollNo("");
                setShowManualAttendance(false);
                await fetchAttendance(); // Refresh the list
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to add manual attendance");
        } finally {
            setIsSubmittingManual(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            {/* <FuturisticBackground /> */}

            {/* Header */}
            <LinearGradient
                colors={
                    isDark
                        ? [colors.background.secondary, colors.background.primary]
                        : ["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.8)"]
                }
                style={[styles.header, { borderBottomColor: colors.surface.glassBorder }]}
            >
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[
                            styles.backButton,
                            {
                                backgroundColor: isDark
                                    ? colors.surface.glass
                                    : "rgba(0, 0, 0, 0.05)",
                            },
                        ]}
                    >
                        <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                            Attendance
                        </Text>
                        <Text
                            style={[styles.headerSubtitle, { color: colors.text.secondary }]}
                            numberOfLines={1}
                        >
                            {lectureTitle}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setShowRollSummary(true)}
                        style={[
                            styles.summaryButton,
                            {
                                backgroundColor: isDark
                                    ? colors.surface.glass
                                    : "rgba(0, 0, 0, 0.05)",
                            },
                        ]}
                    >
                        <Ionicons name="list" size={20} color={colors.primary.main} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View
                        style={[
                            styles.searchBar,
                            {
                                backgroundColor: isDark
                                    ? colors.surface.glass
                                    : "rgba(0, 0, 0, 0.05)",
                                borderColor: colors.surface.glassBorder,
                            },
                        ]}
                    >
                        <Ionicons name="search" size={20} color={colors.text.muted} />
                        <TextInput
                            style={[styles.searchInput, { color: colors.text.primary }]}
                            placeholder="Search student..."
                            placeholderTextColor={colors.text.muted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery("")}>
                                <Ionicons
                                    name="close-circle"
                                    size={18}
                                    color={colors.text.muted}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* // Stats Cards
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    style={styles.statsContainer}
                >
                    <LinearGradient
                        colors={["rgba(34, 197, 94, 0.2)", "rgba(34, 197, 94, 0.05)"]}
                        style={[styles.statCard, { borderColor: "rgba(34, 197, 94, 0.3)" }]}
                    >
                        <View style={styles.statIconContainer}>
                            <Ionicons name="people" size={20} color="#4ADE80" />
                        </View>
                        <View>
                            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Present</Text>
                            <Text style={[styles.statNumber, { color: "#4ADE80" }]}>{presentCount}</Text>
                        </View>
                    </LinearGradient>

                    <LinearGradient
                        colors={["rgba(251, 191, 36, 0.2)", "rgba(251, 191, 36, 0.05)"]}
                        style={[styles.statCard, { borderColor: "rgba(251, 191, 36, 0.3)" }]}
                    >
                        <View style={[styles.statIconContainer, { backgroundColor: "rgba(251, 191, 36, 0.2)" }]}>
                            <Ionicons name="time" size={20} color="#FBBF24" />
                        </View>
                        <View>
                            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Incomplete</Text>
                            <Text style={[styles.statNumber, { color: "#FBBF24" }]}>{incompleteCount}</Text>
                        </View>
                    </LinearGradient>

                    <LinearGradient
                        colors={["rgba(239, 68, 68, 0.2)", "rgba(239, 68, 68, 0.05)"]}
                        style={[styles.statCard, { borderColor: "rgba(239, 68, 68, 0.3)" }]}
                    >
                        <View style={[styles.statIconContainer, { backgroundColor: "rgba(239, 68, 68, 0.2)" }]}>
                            <Ionicons name="person-remove" size={20} color="#F87171" />
                        </View>
                        <View>
                            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Absent</Text>
                            <Text style={[styles.statNumber, { color: "#F87171" }]}>{absentCount}</Text>
                        </View>
                    </LinearGradient>
                </Animated.View> */}

                {/* Filter Tabs */}
                <Animated.View
                    entering={FadeInDown.delay(200).springify()}
                    style={styles.filterContainer}
                >
                    {(["all", "present", "incomplete", "absent"] as FilterType[]).map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[
                                styles.filterButton,
                                filter === f && {
                                    backgroundColor: f === 'present' ? '#4ADE80' : f === 'incomplete' ? '#FBBF24' : f === 'absent' ? '#F87171' : colors.primary.main,
                                },
                                filter !== f && {
                                    backgroundColor: isDark
                                        ? colors.surface.glass
                                        : "rgba(0, 0, 0, 0.05)",
                                    borderWidth: 1,
                                    borderColor: colors.surface.glassBorder,
                                },
                            ]}
                            onPress={() => setFilter(f)}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    {
                                        color: filter === f ? "white" : colors.text.secondary,
                                        fontWeight: filter === f ? "700" : "500",
                                    },
                                ]}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>

                {/* List */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary.main} />
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {filteredAttendance.length === 0 ? (
                            <Animated.View
                                entering={FadeInUp.delay(300).springify()}
                                style={[
                                    styles.emptyState,
                                    {
                                        backgroundColor: isDark ? colors.surface.glass : "rgba(0,0,0,0.02)",
                                        borderColor: colors.surface.glassBorder
                                    }
                                ]}
                            >
                                <Ionicons
                                    name="search-outline"
                                    size={48}
                                    color={colors.text.muted}
                                    style={{ marginBottom: 16, opacity: 0.5 }}
                                />
                                <Text style={[styles.emptyStateText, { color: colors.text.muted }]}>
                                    No students found
                                </Text>
                            </Animated.View>
                        ) : (
                            filteredAttendance.map((record, index) => (
                                <Animated.View
                                    key={record.id}
                                    entering={FadeInDown.delay(300 + index * 50).springify()}
                                    layout={Layout.springify()}
                                    style={[
                                        styles.studentCard,
                                        {
                                            backgroundColor: isDark
                                                ? colors.surface.cardBg
                                                : "rgba(255, 255, 255, 0.7)",
                                            borderColor: colors.surface.glassBorder,
                                            borderLeftColor: getStatusColor(record.status),
                                        },
                                    ]}
                                >
                                    <View style={styles.cardContent}>
                                        {/* Avatar */}
                                        <LinearGradient
                                            colors={
                                                record.status === 'present'
                                                    ? ["rgba(74, 222, 128, 0.2)", "rgba(74, 222, 128, 0.1)"]
                                                    : ["rgba(248, 113, 113, 0.2)", "rgba(248, 113, 113, 0.1)"]
                                            }
                                            style={styles.avatar}
                                        >
                                            <Text style={[styles.avatarText, { color: getStatusColor(record.status) }]}>
                                                {getInitials(record.studentName)}
                                            </Text>
                                        </LinearGradient>

                                        {/* Info */}
                                        <View style={styles.infoContainer}>
                                            <View style={styles.nameRow}>
                                                <Text style={[styles.studentName, { color: colors.text.primary }]}>
                                                    {record.studentName}
                                                </Text>
                                                {record.checkScore < 50 && record.status === 'present' && (
                                                    <Ionicons name="warning" size={16} color="#FBBF24" />
                                                )}
                                            </View>

                                            <Text style={[styles.rollNo, { color: colors.text.secondary }]}>
                                                {record.studentRollNo || "No Roll No"}
                                            </Text>

                                            <View style={styles.metaRow}>
                                                {record.joinTime ? (
                                                    <>
                                                        <View style={styles.metaItem}>
                                                            <Ionicons name="time-outline" size={12} color={colors.text.muted} />
                                                            <Text style={[styles.metaText, { color: colors.text.muted }]}>
                                                                {new Date(record.joinTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.metaDot} />
                                                        <View style={styles.metaItem}>
                                                            <Ionicons
                                                                name={record.method === 'manual' ? "hand-left-outline" : "location-outline"}
                                                                size={12}
                                                                color={colors.text.muted}
                                                            />
                                                            <Text style={[styles.metaText, { color: colors.text.muted }]}>
                                                                {record.method}
                                                            </Text>
                                                        </View>
                                                    </>
                                                ) : (
                                                    <View style={styles.metaItem}>
                                                        <Ionicons name="close-circle-outline" size={12} color={colors.text.muted} />
                                                        <Text style={[styles.metaText, { color: colors.text.muted }]}>
                                                            Did not attend
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>

                                        {/* Roll Number/Status */}
                                        <View style={styles.statusContainer}>
                                            {record.status === 'present' ? (
                                                <View style={styles.rollBadge}>
                                                    <Text style={[styles.rollText, { color: getStatusColor(record.status) }]}>
                                                        {record.studentRollNo || "N/A"}
                                                    </Text>
                                                </View>
                                            ) : record.status === 'incomplete' ? (
                                                <View style={[styles.absentBadge, { backgroundColor: "rgba(251, 191, 36, 0.1)" }]}>
                                                    <Text style={[styles.absentText, { color: "#FBBF24" }]}>INC</Text>
                                                </View>
                                            ) : (
                                                <View style={[styles.absentBadge, { backgroundColor: "rgba(248, 113, 113, 0.1)" }]}>
                                                    <Text style={[styles.absentText, { color: "#F87171" }]}>ABS</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </Animated.View>
                            ))
                        )}
                    </View>
                )}
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Roll Number Summary Modal */}
            <Modal
                visible={showRollSummary}
                transparent
                animationType="fade"
                onRequestClose={() => setShowRollSummary(false)}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: isDark
                                    ? colors.background.secondary
                                    : "rgba(255, 255, 255, 0.98)",
                            },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                                Present Students
                            </Text>
                            <TouchableOpacity onPress={() => setShowRollSummary(false)}>
                                <Ionicons name="close" size={24} color={colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <View
                            style={[
                                styles.rollNumberBox,
                                {
                                    backgroundColor: isDark
                                        ? colors.surface.glass
                                        : "rgba(0, 0, 0, 0.03)",
                                    borderColor: colors.surface.glassBorder,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.rollNumberText,
                                    { color: colors.text.primary },
                                ]}
                                selectable
                            >
                                {getPresentRollNumbers() || "No present students"}
                            </Text>
                        </View>

                        <View style={styles.modalStats}>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: "#4ADE80" }]}>
                                    {presentCount}
                                </Text>
                                <Text style={[styles.statLabelSmall, { color: colors.text.secondary }]}>
                                    Present
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: "#FBBF24" }]}>
                                    {incompleteCount}
                                </Text>
                                <Text style={[styles.statLabelSmall, { color: colors.text.secondary }]}>
                                    Incomplete
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: "#F87171" }]}>
                                    {absentCount}
                                </Text>
                                <Text style={[styles.statLabelSmall, { color: colors.text.secondary }]}>
                                    Absent
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.copyButton,
                                { backgroundColor: colors.primary.main },
                            ]}
                            onPress={handleCopyRollNumbers}
                        >
                            <Ionicons name="copy-outline" size={20} color="white" />
                            <Text style={styles.copyButtonText}>Copy Roll Numbers</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Manual Attendance Modal */}
            <Modal
                visible={showManualAttendance}
                transparent
                animationType="fade"
                onRequestClose={() => setShowManualAttendance(false)}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: isDark
                                    ? colors.background.secondary
                                    : "rgba(255, 255, 255, 0.98)",
                            },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                                Add Manual Attendance
                            </Text>
                            <TouchableOpacity onPress={() => setShowManualAttendance(false)}>
                                <Ionicons name="close" size={24} color={colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.modalDescription, { color: colors.text.secondary }]}>
                            Enter the student's roll number to manually mark them present. This is useful for students who had technical issues or forgot their device.
                        </Text>

                        <View
                            style={[
                                styles.inputContainer,
                                {
                                    backgroundColor: isDark
                                        ? colors.surface.glass
                                        : "rgba(0, 0, 0, 0.03)",
                                    borderColor: colors.surface.glassBorder,
                                },
                            ]}
                        >
                            <Ionicons name="id-card-outline" size={20} color={colors.text.muted} />
                            <TextInput
                                style={[styles.input, { color: colors.text.primary }]}
                                placeholder="e.g., 101, R001"
                                placeholderTextColor={colors.text.muted}
                                value={manualRollNo}
                                onChangeText={setManualRollNo}
                                autoCapitalize="characters"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[
                                    styles.actionButton,
                                    styles.cancelButton,
                                    {
                                        backgroundColor: isDark
                                            ? colors.surface.glass
                                            : "rgba(0, 0, 0, 0.05)",
                                    },
                                ]}
                                onPress={() => {
                                    setManualRollNo("");
                                    setShowManualAttendance(false);
                                }}
                            >
                                <Text style={[styles.cancelButtonText, { color: colors.text.secondary }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.actionButton,
                                    styles.submitButton,
                                    { backgroundColor: colors.primary.main },
                                ]}
                                onPress={handleManualAttendance}
                                disabled={isSubmittingManual}
                            >
                                {isSubmittingManual ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark-circle" size={20} color="white" />
                                        <Text style={styles.submitButtonText}>Mark Present</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Floating Action Button for Manual Attendance */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.primary.main }]}
                onPress={() => setShowManualAttendance(true)}
            >
                <Ionicons name="person-add" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    summaryButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitleContainer: {
        alignItems: "center",
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        marginTop: 2,
        opacity: 0.7,
    },
    searchContainer: {
        width: "100%",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        height: 46,
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        height: "100%",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    statsContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        gap: 12,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(74, 222, 128, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    statLabel: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "800",
    },
    filterContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    filterButtonText: {
        fontSize: 14,
    },
    loadingContainer: {
        padding: 40,
        alignItems: "center",
    },
    listContainer: {
        gap: 12,
    },
    emptyState: {
        padding: 40,
        borderRadius: 24,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        borderStyle: "dashed",
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: "500",
    },
    studentCard: {
        borderRadius: 20,
        borderWidth: 1,
        borderLeftWidth: 4,
        padding: 16,
        overflow: "hidden",
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: "700",
    },
    infoContainer: {
        flex: 1,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 4,
    },
    studentName: {
        fontSize: 16,
        fontWeight: "700",
    },
    rollNo: {
        fontSize: 13,
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        fontWeight: "500",
    },
    metaDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: "rgba(150,150,150,0.5)",
        marginHorizontal: 8,
    },
    statusContainer: {
        alignItems: "flex-end",
        justifyContent: "center",
        marginLeft: 8,
    },
    rollBadge: {
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "rgba(74, 222, 128, 0.1)",
    },
    rollText: {
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    absentBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    absentText: {
        fontSize: 12,
        fontWeight: "800",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        width: "100%",
        maxWidth: 500,
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "700",
    },
    rollNumberBox: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
        marginBottom: 20,
        minHeight: 80,
    },
    rollNumberText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "500",
    },
    modalStats: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
        paddingVertical: 16,
    },
    statItem: {
        alignItems: "center",
    },
    statValue: {
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 4,
    },
    statLabelSmall: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
    },
    copyButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    copyButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        marginBottom: 24,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        height: "100%",
    },
    modalActions: {
        flexDirection: "row",
        gap: 12,
    },
    actionButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: "rgba(150, 150, 150, 0.2)",
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    submitButton: {},
    submitButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    },
});
export default AttendanceViewScreen;
