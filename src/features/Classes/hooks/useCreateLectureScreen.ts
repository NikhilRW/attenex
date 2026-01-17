import { mutationKeys } from "@/shared/constants/mutationKeys";
import { queryKeys } from "@/shared/constants/queryKeys";
import { lectureService } from "@classes/services";
import { ClassItem, LectureWithCount } from "@classes/types";
import { getMinHeightForScrollView } from "@classes/utils/common";
import { storage } from "@shared/utils/mmkvStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

export const useCreateLectureScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [lectureName, setLectureName] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [duration, setDuration] = useState(60);
  const [customDuration, setCustomDuration] = useState("");

  // Dropdown states
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  const navigateToTeacherDashboard = () => {
    router.navigate("/classes?fromCreateLecture=true");
  };

  const fetchTeacherClasses: () => Promise<ClassItem[]> =
    useCallback(async () => {
      try {
        const res = await lectureService.getTeacherClasses();
        let currentClasses: ClassItem[] = [];
        if (res.success) {
          currentClasses = [...res.data];
        }

        // Load user-created classes from local storage
        const savedClasses = storage.getString("user_created_classes");
        if (savedClasses) {
          const parsedClasses = JSON.parse(savedClasses);
          // Merge with existing classes, avoiding duplicates
          const allClasses = [...currentClasses];
          parsedClasses.forEach((saved: ClassItem) => {
            if (!allClasses.find((c) => c.name === saved.name)) {
              allClasses.push(saved);
            }
          });
          return allClasses;
        }
        return currentClasses;
      } catch (error) {
        console.log("Error fetching classes", error);
        return [];
      }
    }, []);

  const { data: existingClasses } = useQuery({
    queryFn: fetchTeacherClasses,
    queryKey: queryKeys.existingClassesForTeacher,
  });

  const handleCreateLectureMutateFn = async () => {
    if (!lectureName || !selectedClass) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    const finalDuration = duration === -1 ? parseInt(customDuration) : duration;
    if (isNaN(finalDuration) || finalDuration <= 0) {
      Alert.alert(
        "Invalid Duration",
        "Please enter a valid duration in minutes.",
      );
      return;
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Location is required to start a lecture.",
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const res = await lectureService.createLecture(
      lectureName,
      selectedClass,
      finalDuration,
      location.coords.latitude,
      location.coords.longitude,
    );

    return res;
  };

  const { mutateAsync: handleCreateLecture, isPending: loading } = useMutation({
    mutationFn: handleCreateLectureMutateFn,
    onMutate: async (_, context) => {
      // Snapshot the previous value
      const previousLetures = context.client.getQueryData(
        queryKeys.teacherLectures,
      );

      const newLecture = {
        id: "",
        title: lectureName,
        courseName: selectedClass,
        createdAt: "",
        studentCount: 0,
        absentCount: 0,
        totalClassStudents: 1,
        status: "active" as const,
        duration: "10",
      };

      // Optimistically update to the new value
      context.client.setQueryData<LectureWithCount[]>(
        queryKeys.teacherLectures,
        (old) => {
          if (old) {
            return [...old, newLecture];
          } else {
            return [newLecture];
          }
        },
      );

      navigateToTeacherDashboard();
      return { previousLetures };
    },
    onSuccess: async (data, _, onMutateResult, context) => {
      if (data.success) {
        Alert.alert("Success", "Lecture created successfully!", [
          { text: "OK" },
        ]);
        await context.client.invalidateQueries({
          queryKey: queryKeys.teacherLectures,
        });
      } else {
        context.client.setQueryData(
          queryKeys.teacherLectures,
          onMutateResult.previousLetures,
        );
      }
    },
    onError(error) {
      Alert.alert("Error", error.message || "Failed to create lecture");
    },
    mutationKey: mutationKeys.createLecture,
  });

  const handleAddNewClass = () => {
    setShowClassDropdown(false);
    setShowNewClassModal(true);
  };

  const handleCreateNewClassMutateFN = async () => {
    if (!newClassName.trim()) {
      Alert.alert("Error", "Please enter a class name");
      return;
    }

    const newClass = { id: Date.now().toString(), name: newClassName.trim() };
    // Save user-created classes to MMKV
    const savedClasses = storage.getString("user_created_classes");
    const parsedClasses = savedClasses ? JSON.parse(savedClasses) : [];
    parsedClasses.push(newClass);
    storage.set("user_created_classes", JSON.stringify(parsedClasses));
  };

  const { mutateAsync: handleCreateNewClass } = useMutation({
    mutationFn: handleCreateNewClassMutateFN,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: queryKeys.existingClassesForTeacher,
      });
    },
    onError(error) {
      console.log("Error saving class to storage", error);
    },
    onSettled() {
      setNewClassName("");
      setShowNewClassModal(false);
      setShowClassDropdown(true);
    },
  });

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
