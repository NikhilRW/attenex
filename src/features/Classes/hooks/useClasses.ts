import { useTheme } from "@/src/shared/hooks/useTheme";
import { lectureService } from "@/src/shared/services/lectureService";
import { useRouter } from "expo-router";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";

export const useClasses = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [lectureName, setLectureName] = useState("");
  const [className, setClassName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateLecture = async () => {
    if (!lectureName.trim() || !className.trim()) {
      showMessage({
        message: "Validation Error",
        description: "Please fill in all fields",
        type: "danger",
        duration: 3000,
      });
      return;
    }

    setIsCreating(true);

    try {
      const response = await lectureService.createLecture({
        className: className.trim(),
        lectureName: lectureName.trim(),
      });

      if (response.success) {
        showMessage({
          message: "Success",
          description: `Lecture "${response.data?.lecture.title}" created successfully! Passcode: ${response.data?.lecture.passcode}`,
          type: "success",
          duration: 5000,
        });
        setLectureName("");
        setClassName("");
        // Optionally navigate or perform other actions
      } else {
        showMessage({
          message: "Error",
          description: response.message || "Failed to create lecture",
          type: "danger",
          duration: 3000,
        });
      }
    } catch (error: any) {
      showMessage({
        message: "Error",
        description: error.message || "An unexpected error occurred",
        type: "danger",
        duration: 3000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    colors,
    router,
    lectureName,
    setLectureName,
    className,
    setClassName,
    isCreating,
    handleCreateLecture,
  };
};
