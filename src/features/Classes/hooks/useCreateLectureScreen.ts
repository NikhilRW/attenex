import { mutationKeys } from "@/shared/constants/mutationKeys";
import { queryKeys } from "@/shared/constants/queryKeys";
import { lectureService } from "@classes/services/lectureService";
import { ClassItem, LectureWithCount } from "@classes/types/common";
import { CreateLectureAPIResponse } from "@classes/types/api";
import { getMinHeightForScrollView } from "@classes/utils/common";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";
import { CreateLectureVariables } from "../types/params";
import { selectionAsync } from "expo-haptics";
import { useHapticAlerts } from "@/shared/hooks/useHapticAlerts";

export const useCreateLectureScreen = () => {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const [lectureName, setLectureName] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [duration, setDuration] = useState(60);
  const [customDuration, setCustomDuration] = useState("");

  // Dropdown states
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  const { alert } = useHapticAlerts();

  const navigateToTeacherDashboard = () => {
    router.navigate("/classes");
  };

  const fetchTeacherClasses: () => Promise<ClassItem[] | null> =
    useCallback(async () => {
      try {
        const res = await lectureService.getTeacherClasses();
        let currentClasses: ClassItem[] = [];
        if (res.success) {
          currentClasses = [...res.data];
        }
        return currentClasses;
      } catch (error) {
        console.log("Error fetching classes", error);
        throw error;
      }
    }, []);

  const { data: existingClasses } = useQuery({
    queryFn: fetchTeacherClasses,
    queryKey: queryKeys.classes.teacher,
    networkMode: "offlineFirst",
    enabled: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const resetValues = useCallback(() => {
    setLectureName("");
    setSelectedClass("");
    setDuration(0);
    setCustomDuration("");
  }, []);

  const { mutateAsync: handleCreateLecture, isPending: loading } = useMutation<
    CreateLectureAPIResponse | undefined,
    Error,
    CreateLectureVariables,
    { previousLectures: LectureWithCount[] | undefined; tempLectureId?: string }
  >({
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({
        queryKey: queryKeys.lectures.teacher,
      });

      const previousLectures = context.client.getQueryData<LectureWithCount[]>(
        queryKeys.lectures.teacher,
      );

      const optimisticTitle = variables.lectureName.trim();
      const optimisticClass = variables.selectedClass.trim();

      if (!optimisticTitle || !optimisticClass) {
        return { previousLectures };
      }

      const tempLectureId = "temp-" + new Date().getTime();
      const optimisticDuration =
        variables.duration === -1
          ? variables.customDuration.trim()
          : String(variables.duration);
      const newLecture: LectureWithCount = {
        id: tempLectureId,
        title: optimisticTitle,
        courseName: optimisticClass,
        createdAt: new Date().toISOString(),
        studentCount: 0,
        absentCount: 0,
        totalClassStudents: 0,
        status: "active" as const,
        duration: optimisticDuration,
      };

      // Optimistically update to the new value
      context.client.setQueryData<LectureWithCount[]>(
        queryKeys.lectures.teacher,
        (old) => {
          if (old) {
            return [newLecture, ...old];
          } else {
            return [newLecture];
          }
        },
      );
      navigateToTeacherDashboard();
      return { previousLectures, tempLectureId };
    },
    onSuccess: async (data, _, onMutateResult, context) => {
      if (!onMutateResult?.tempLectureId) {
        return;
      }
      resetValues();
      if (data?.success && data.data?.lecture) {
        const createdLecture = data.data.lecture;
        const lectureWithCount: LectureWithCount = {
          id: createdLecture.id,
          title: createdLecture.title,
          courseName: createdLecture.className,
          createdAt:
            createdLecture.createdAt instanceof Date
              ? createdLecture.createdAt.toISOString()
              : createdLecture.createdAt,
          studentCount: 0,
          absentCount: 0,
          totalClassStudents: 0,
          status: createdLecture.status === "ended" ? "ended" : "active",
          duration: createdLecture.duration,
        };

        context.client.setQueryData<LectureWithCount[]>(
          queryKeys.lectures.teacher,
          (old) => {
            if (!old) {
              return [lectureWithCount];
            }

            let replacedTempLecture = false;
            const lecturesWithoutDuplicate = old.filter(
              (lecture) => lecture.id !== lectureWithCount.id,
            );
            const nextLectures = lecturesWithoutDuplicate.map((lecture) => {
              if (lecture.id !== onMutateResult.tempLectureId) {
                return lecture;
              }

              replacedTempLecture = true;
              return lectureWithCount;
            });

            return replacedTempLecture
              ? nextLectures
              : [lectureWithCount, ...nextLectures];
          },
        );
        alert("Success", "Lecture created successfully!", [{ text: "OK" }]);
        await context.client.invalidateQueries({
          queryKey: queryKeys.lectures.teacher,
          refetchType: "none",
        });
      } else {
        context.client.setQueryData(
          queryKeys.lectures.teacher,
          onMutateResult.previousLectures,
        );
        if (data) {
          alert("Error", "Failed to create lecture kindly try again", [
            { text: "OK", onPress: selectionAsync },
          ]);
        }
      }
    },
    onError(error, _, onMutateResult, context) {
      alert("Error", error.message || "Failed to create lecture");
      context.client.setQueryData(
        queryKeys.lectures.teacher,
        onMutateResult?.previousLectures,
      );
    },
    mutationKey: mutationKeys.lectures.create,
  });

  const handleAddNewClass = () => {
    setShowClassDropdown(false);
    setShowNewClassModal(true);
  };

  const afterClassNameAdded = useCallback(() => {
    setNewClassName("");
    setShowNewClassModal(false);
    setShowClassDropdown(true);
  }, []);

  const { mutateAsync: handleCreateNewClass } = useMutation<
    { success: boolean; message: string },
    Error,
    string,
    { previousClasses: ClassItem[] } | null
  >({
    mutationKey: mutationKeys.classes.create,
    onMutate: async (params, context) => {
      if (!params.trim()) {
        alert("Error", "Please enter a class name");
        return null;
      }
      const newClassNameParam = params.trim();
      await context.client.cancelQueries({
        queryKey: queryKeys.classes.teacher,
      });
      const previousClasses = context.client.getQueryData<ClassItem[]>(
        queryKeys.classes.teacher,
      );
      context.client.setQueryData<ClassItem[]>(
        queryKeys.classes.teacher,
        (old) => {
          const newClassNames: ClassItem[] = [];
          if (old) {
            newClassNames.push(
              ...old.filter((classEle) => classEle.name !== newClassNameParam),
            );
          }
          newClassNames.push({
            id: "temp" + new Date().getTime(),
            name: newClassNameParam,
          });
          return newClassNames;
        },
      );
      afterClassNameAdded();
      return {
        previousClasses: previousClasses!,
      };
    },
    onSuccess: async (res, _, onMutateResult, context) => {
      if (res.success) {
        await context.client.invalidateQueries({
          queryKey: queryKeys.classes.teacher,
        });
      } else if (onMutateResult?.previousClasses) {
        context.client.setQueryData<ClassItem[]>(
          queryKeys.classes.teacher,
          onMutateResult.previousClasses,
        );
        alert("Class not Added sucessfully");
      }
    },
    onError(error, _, onMutateResult, context) {
      if (onMutateResult?.previousClasses) {
        context.client.setQueryData<ClassItem[]>(
          queryKeys.classes.teacher,
          onMutateResult.previousClasses,
        );
      }

      if ((error as any).response?.status === 409) {
        alert("Info", "Class name added already exists");
      } else {
        alert("Error", error.message || "Failed to add class");
      }
      console.log("Error saving class", error);
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

  const minHeightScrollView = useMemo(
    () => getMinHeightForScrollView(height),
    [height],
  );

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
