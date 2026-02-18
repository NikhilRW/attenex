import { mutationKeys } from "@/shared/constants/mutationKeys";
import { queryKeys } from "@/shared/constants/queryKeys";
import { lectureService } from "@classes/services";
import {
  ClassItem,
  CreateLectureAPIResponse,
  LectureWithCount,
} from "@classes/types";
import { getMinHeightForScrollView } from "@classes/utils/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { useAlerts } from "react-native-paper-alerts";
import { CreateLectureVariables } from "../types/params";

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

  const { alert } = useAlerts();

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
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { mutateAsync: handleCreateLecture, isPending: loading } = useMutation<
    CreateLectureAPIResponse,
    Error,
    CreateLectureVariables,
    { previousLetures: LectureWithCount[] | undefined }
  >({
    onMutate: async (_, context) => {
      // Snapshot the previous value
      const previousLetures = await context.client.getQueryData<
        LectureWithCount[]
      >(queryKeys.lectures.teacher);

      const newLecture = {
        id: "temp-" + new Date().getTime(),
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
        queryKeys.lectures.teacher,
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
      if (data && data.success) {
        alert("Success", "Lecture created successfully!", [{ text: "OK" }]);
        await context.client.invalidateQueries({
          queryKey: queryKeys.lectures.teacher,
        });
      } else {
        context.client.setQueryData(
          queryKeys.lectures.teacher,
          onMutateResult.previousLetures,
        );
      }
    },
    onError(error, _, onMutateResult, context) {
      alert("Error", error.message || "Failed to create lecture");
      context.client.setQueryData(
        queryKeys.lectures.teacher,
        onMutateResult!.previousLetures,
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
    { success: boolean },
    Error,
    string,
    { previousClasses: ClassItem[] } | null
  >({
    mutationKey: mutationKeys.classes.create,
    onMutate: (params, context) => {
      if (!params.trim()) {
        alert("Error", "Please enter a class name");
        return null;
      }
      const newClassNameParam = params.trim();
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
      return {
        previousClasses: previousClasses!,
      };
    },
    onSuccess: (res, _, onMutateResult, context) => {
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.classes.teacher,
        });
      } else if (onMutateResult?.previousClasses) {
        context.client.setQueryData<ClassItem[]>(
          queryKeys.classes.teacher,
          onMutateResult.previousClasses,
        );
        alert("Class not Added sucessfully");
      }
      afterClassNameAdded();
    },
    onError(error) {
      console.log("Error saving class", error);
      alert(error.name);
      afterClassNameAdded();
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
