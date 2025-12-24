import { storage } from "@/src/shared/utils/mmkvStorage";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { createLecture, getTeacherClasses } from "../services/lectureService";
import { ClassItem } from "../types/common";
import { getMinHeightForScrollView } from "../utils/common";

export const DURATION_OPTIONS = [
  { label: "30 min", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
  { label: "Custom", value: -1 },
];

export const useCreateLectureScreen = () => {
  const router = useRouter();

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

  const handleGoBack = () => router.back();

  const handleToggleClassDropdown = () => {
    setShowClassDropdown(!showClassDropdown);
    setShowDurationDropdown(false);
  };

  const handleSelectClass = (className: string) => {
    setSelectedClass(className);
    setShowClassDropdown(false);
  };

  const handleToggleDurationDropdown = () => {
    setShowDurationDropdown(!showDurationDropdown);
    setShowClassDropdown(false);
  };

  const handleSelectDuration = (val: number) => {
    setDuration(val);
    setShowDurationDropdown(false);
  };

  const handleCloseNewClassModal = () => setShowNewClassModal(false);

  const minHeightScrollView = useMemo(() => getMinHeightForScrollView(), []);

  return {
    // State
    lectureName,
    setLectureName,
    selectedClass,
    duration,
    customDuration,
    setCustomDuration,
    loading,
    existingClasses,
    showClassDropdown,
    showDurationDropdown,
    showNewClassModal,
    newClassName,
    setNewClassName,
    minHeightScrollView,

    // Handlers
    handleCreateLecture,
    handleAddNewClass,
    handleCreateNewClass,
    handleGoBack,
    handleToggleClassDropdown,
    handleSelectClass,
    handleToggleDurationDropdown,
    handleSelectDuration,
    handleCloseNewClassModal,
  };
};
