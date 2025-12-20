import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { storage } from "@/src/shared/utils/mmkvStorage";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { ClassSelector } from "../components/ClassSelector";
import { CreateLectureHeader } from "../components/CreateLectureHeader";
import { DurationSelector } from "../components/DurationSelector";
import { NewClassModal } from "../components/NewClassModal";
import { StartLectureButton } from "../components/StartLectureButton";
import { TopicInput } from "../components/TopicInput";
import { createLecture, getTeacherClasses } from "../services/lectureService";
import { styles } from "../styles/CreateLecture.styles";
import { ClassItem } from "../types/common";
import { getMinHeightForScrollView } from "../utils/common";

const DURATION_OPTIONS = [
  { label: "30 min", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
  { label: "Custom", value: -1 },
];

const CreateLectureScreen = () => {
  const router = useRouter();
  const { colors, isDark } = useTheme();

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
      const savedClasses = storage.getString("user_created_classes");
      if (savedClasses) {
        const parsedClasses = JSON.parse(savedClasses);
        // Merge with existing classes, avoiding duplicates
        const allClasses = [...res.data];
        parsedClasses.forEach((saved: ClassItem) => {
          if (!allClasses.find((c) => c.name === saved.name)) {
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

    const newClass = { id: Date.now().toString(), name: newClassName.trim() };
    const updatedClasses = [...existingClasses, newClass];
    setExistingClasses(updatedClasses);
    setSelectedClass(newClassName);

    // Save user-created classes to MMKV
    try {
      const savedClasses = storage.getString("user_created_classes");
      const parsedClasses = savedClasses ? JSON.parse(savedClasses) : [];
      parsedClasses.push(newClass);
      storage.set("user_created_classes", JSON.stringify(parsedClasses));
    } catch (error) {
      console.log("Error saving class to storage", error);
    }

    setNewClassName("");
    setShowNewClassModal(false);
  };

  const minHeightScrollView = useMemo(() => getMinHeightForScrollView(), []);

  return (
    <View style={styles.container}>
      <FuturisticBackground />

      <CreateLectureHeader onBack={() => router.back()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { minHeight: minHeightScrollView },
          ]}
          keyboardShouldPersistTaps="always"
        >
          <Animated.View entering={FadeInUp.delay(100).springify()}>
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]
                  : ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.5)"]
              }
              style={[styles.card, { borderColor: colors.surface.glassBorder }]}
            >
              <Text
                style={{
                  color: colors.text.secondary,
                  fontSize: 12,
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 16,
                }}
              >
                Class Details
              </Text>

              <ClassSelector
                selectedClass={selectedClass}
                existingClasses={existingClasses}
                showDropdown={showClassDropdown}
                onToggleDropdown={() => {
                  setShowClassDropdown(!showClassDropdown);
                  setShowDurationDropdown(false);
                }}
                onSelectClass={(className) => {
                  setSelectedClass(className);
                  setShowClassDropdown(false);
                }}
                onAddNewClass={handleAddNewClass}
              />

              <TopicInput value={lectureName} onChangeText={setLectureName} />

              <View
                style={{
                  height: 1,
                  backgroundColor: colors.surface.glassBorder,
                  marginVertical: 24,
                }}
              />

              <Text
                style={{
                  color: colors.text.secondary,
                  fontSize: 12,
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 16,
                }}
              >
                Time & Duration
              </Text>

              <DurationSelector
                duration={duration}
                customDuration={customDuration}
                showDropdown={showDurationDropdown}
                onToggleDropdown={() => {
                  setShowDurationDropdown(!showDurationDropdown);
                  setShowClassDropdown(false);
                }}
                onSelectDuration={(val) => {
                  setDuration(val);
                  setShowDurationDropdown(false);
                }}
                onChangeCustomDuration={setCustomDuration}
                options={DURATION_OPTIONS}
              />

              <View>
                <StartLectureButton
                  loading={loading}
                  onPress={handleCreateLecture}
                />
              </View>
            </LinearGradient>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <NewClassModal
        visible={showNewClassModal}
        onClose={() => setShowNewClassModal(false)}
        newClassName={newClassName}
        setNewClassName={setNewClassName}
        onCreateClass={handleCreateNewClass}
      />
    </View>
  );
};

export default CreateLectureScreen;
