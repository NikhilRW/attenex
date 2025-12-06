import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { storage } from "@/src/shared/utils/mmkvStorage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
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
  View,
} from "react-native";
import { createLecture, getTeacherClasses } from "../services/lectureService";

interface ClassItem {
  id: string;
  name: string;
}

const DURATION_OPTIONS = [
  { label: "30 min", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
  { label: "Custom", value: -1 },
];

const CreateLectureScreen = () => {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";

  const [lectureName, setLectureName] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [duration, setDuration] = useState(60);
  const [customDuration, setCustomDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingClasses, setExistingClasses] = useState<ClassItem[]>([]);

  // Dropdown states
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  const fetchTeacherClasses = useCallback(async () => {
    try {
      const res = await getTeacherClasses();
      if (res.success) {
        setExistingClasses(res.data);
      }

      // Load user-created classes from local storage
      const savedClasses = storage.getString('user_created_classes');
      if (savedClasses) {
        const parsedClasses = JSON.parse(savedClasses);
        // Merge with existing classes, avoiding duplicates
        const allClasses = [...res.data];
        parsedClasses.forEach((saved: ClassItem) => {
          if (!allClasses.find(c => c.name === saved.name)) {
            allClasses.push(saved);
          }
        });
        setExistingClasses(allClasses);
      }
    } catch (error) {
      console.log("Error fetching classes", error);
    }
  }, []);

  useEffect(() => {
    fetchTeacherClasses();
  }, [fetchTeacherClasses]);

  const handleCreateLecture = async () => {
    if (!lectureName || !selectedClass) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    const finalDuration = duration === -1 ? parseInt(customDuration) : duration;
    if (isNaN(finalDuration) || finalDuration <= 0) {
      Alert.alert(
        "Invalid Duration",
        "Please enter a valid duration in minutes."
      );
      return;
    }

    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location is required to start a lecture."
        );
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const res = await createLecture(
        lectureName,
        selectedClass,
        finalDuration,
        location.coords.latitude,
        location.coords.longitude
      );

      if (res.success) {
        Alert.alert("Success", "Lecture created successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create lecture");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewClass = () => {
    setShowClassDropdown(false);
    setShowNewClassModal(true);
  };

  const handleCreateNewClass = async () => {
    if (!newClassName.trim()) {
      Alert.alert("Error", "Please enter a class name");
      return;
    }

    const newClass = { id: Date.now().toString(), name: newClassName };
    const updatedClasses = [...existingClasses, newClass];
    setExistingClasses(updatedClasses);
    setSelectedClass(newClassName);

    // Save user-created classes to MMKV
    try {
      const savedClasses = storage.getString('user_created_classes');
      const parsedClasses = savedClasses ? JSON.parse(savedClasses) : [];
      parsedClasses.push(newClass);
      storage.set('user_created_classes', JSON.stringify(parsedClasses));
    } catch (error) {
      console.log("Error saving class to storage", error);
    }

    setNewClassName("");
    setShowNewClassModal(false);
  };

  const selectedDurationLabel =
    duration === -1
      ? "Custom"
      : DURATION_OPTIONS.find((opt) => opt.value === duration)?.label ||
      "1 hour";

  return (
    <View style={styles.container}>
      <FuturisticBackground />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          New Lecture
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]
              : ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.8)"]
          }
          style={[styles.card, { borderColor: colors.surface.glassBorder }]}
        >
          {/* Class Dropdown */}
          <View style={[styles.inputGroup, { zIndex: 20 }]}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              Class Name
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowClassDropdown(!showClassDropdown);
                setShowDurationDropdown(false);
              }}
              style={[
                styles.dropdown,
                {
                  backgroundColor: isDark
                    ? "rgba(0, 0, 0, 0.2)"
                    : "rgba(255, 255, 255, 0.5)",
                  borderColor: colors.surface.glassBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.dropdownText,
                  {
                    color: selectedClass
                      ? colors.text.primary
                      : colors.text.muted,
                  },
                ]}
              >
                {selectedClass || "Select a class"}
              </Text>
              <Ionicons
                name={showClassDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>

            {showClassDropdown && (
              <View
                style={[
                  styles.dropdownMenu,
                  {
                    backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                    borderColor: colors.surface.glassBorder,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 10,
                  },
                ]}
              >
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {existingClasses.map((cls) => (
                    <TouchableOpacity
                      key={cls.id}
                      onPress={() => {
                        setSelectedClass(cls.name);
                        setShowClassDropdown(false);
                      }}
                      style={[
                        styles.dropdownItem,
                        {
                          backgroundColor:
                            selectedClass === cls.name
                              ? isDark
                                ? "rgba(8, 145, 178, 0.2)"
                                : "rgba(8, 145, 178, 0.1)"
                              : "transparent",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          { color: colors.text.primary },
                        ]}
                      >
                        {cls.name}
                      </Text>
                      {selectedClass === cls.name && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={colors.primary.main}
                        />
                      )}
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    onPress={handleAddNewClass}
                    style={[
                      styles.addClassButton,
                      {
                        borderTopColor: colors.surface.glassBorder,
                        borderTopWidth: 1,
                      },
                    ]}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color={colors.primary.main}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        styles.addClassButtonText,
                        { color: colors.primary.main },
                      ]}
                    >
                      Add New Class
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </View>

          {/* Lecture Topic Input */}
          <View style={[styles.inputGroup, { zIndex: 10 }]}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              Lecture Topic
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: isDark
                    ? "rgba(0, 0, 0, 0.2)"
                    : "rgba(255, 255, 255, 0.5)",
                  borderColor: colors.surface.glassBorder,
                  color: colors.text.primary,
                },
              ]}
              placeholder="Enter lecture topic"
              placeholderTextColor={colors.text.muted}
              value={lectureName}
              onChangeText={setLectureName}
            />
          </View>

          {/* Duration Dropdown */}
          <View style={[styles.inputGroupLarge, { zIndex: 15 }]}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              Duration
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowDurationDropdown(!showDurationDropdown);
                setShowClassDropdown(false);
              }}
              style={[
                styles.dropdown,
                {
                  backgroundColor: isDark
                    ? "rgba(0, 0, 0, 0.2)"
                    : "rgba(255, 255, 255, 0.5)",
                  borderColor: colors.surface.glassBorder,
                },
              ]}
            >
              <Text
                style={[styles.dropdownText, { color: colors.text.primary }]}
              >
                {selectedDurationLabel}
              </Text>
              <Ionicons
                name={showDurationDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>

            {showDurationDropdown && (
              <View
                style={[
                  styles.dropdownMenu,
                  {
                    backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                    borderColor: colors.surface.glassBorder,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 10,
                  },
                ]}
              >
                {DURATION_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    onPress={() => {
                      setDuration(option.value);
                      setShowDurationDropdown(false);
                    }}
                    style={[
                      styles.dropdownItem,
                      {
                        backgroundColor:
                          duration === option.value
                            ? isDark
                              ? "rgba(8, 145, 178, 0.2)"
                              : "rgba(8, 145, 178, 0.1)"
                            : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        { color: colors.text.primary },
                      ]}
                    >
                      {option.label}
                    </Text>
                    {duration === option.value && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors.primary.main}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Custom Duration Input */}
          {duration === -1 && (
            <View style={[styles.inputGroup, { marginTop: -20 }]}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                Custom Duration (minutes)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark
                      ? "rgba(0, 0, 0, 0.2)"
                      : "rgba(255, 255, 255, 0.5)",
                    borderColor: colors.surface.glassBorder,
                    color: colors.text.primary,
                  },
                ]}
                placeholder="Enter minutes"
                placeholderTextColor={colors.text.muted}
                value={customDuration}
                onChangeText={setCustomDuration}
                keyboardType="numeric"
              />
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: colors.primary.main,
                opacity: loading ? 0.7 : 1,
              },
            ]}
            onPress={handleCreateLecture}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.primaryButtonText}>Start Lecture</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>

      {/* New Class Modal */}
      <Modal
        visible={showNewClassModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNewClassModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 20,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              Add New Class
            </Text>

            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)",
                  borderColor: colors.surface.glassBorder,
                  color: colors.text.primary,
                },
              ]}
              placeholder="Enter class name (e.g., CS101)"
              placeholderTextColor={colors.text.muted}
              value={newClassName}
              onChangeText={setNewClassName}
            />

            <View style={styles.modalButtons}>
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
                  setNewClassName("");
                  setShowNewClassModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalButtonTextSecondary,
                    { color: colors.text.secondary },
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
                onPress={handleCreateNewClass}
              >
                <Text style={styles.modalButtonTextPrimary}>Add Class</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    marginBottom: 32,
    overflow: "visible",
  },
  inputGroup: {
    marginBottom: 20,
    position: "relative",
  },
  inputGroupLarge: {
    marginBottom: 32,
    position: "relative",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 4,
    opacity: 0.9,
  },
  dropdown: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownMenu: {
    position: "absolute",
    top: "110%",
    left: 0,
    right: 0,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    zIndex: 1000,
  },
  dropdownScroll: {
    maxHeight: 240,
  },
  dropdownItem: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  addClassButton: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addClassButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  textInput: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  primaryButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 16,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    borderRadius: 24,
    padding: 32,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  modalInput: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 16,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  modalButtonTextSecondary: {
    fontWeight: "600",
    fontSize: 16,
  },
  modalButtonTextPrimary: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CreateLectureScreen;
