import type { AddTeacherSubjectSuccessResponse } from "@attenex/api-contracts";
import { mutationKeys } from "@/shared/constants/mutationKeys";
import { queryKeys } from "@/shared/constants/queryKeys";
import { lectureService } from "@classes/services/lectureService";
import { ClassItem, LectureWithCount, SubjectItem } from "@classes/types/common";
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
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [duration, setDuration] = useState(60);
  const [customDuration, setCustomDuration] = useState("");

  // Dropdown states
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [showNewSubjectModal, setShowNewSubjectModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [subjectError, setSubjectError] = useState("");

  const { alert } = useHapticAlerts();

  const navigateToTeacherDashboard = () => {
    router.navigate("/classes");
  };

  const fetchTeacherClasses: () => Promise<ClassItem[] | null> = useCallback(async () => {
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

  const fetchTeacherSubjects: () => Promise<SubjectItem[] | null> = useCallback(async () => {
    try {
      const res = await lectureService.getSubjects();
      let currentSubjects: SubjectItem[] = [];
      if (res.success) {
        currentSubjects = [...res.data];
      }
      return currentSubjects;
    } catch (error) {
      console.log("Error fetching subjects", error);
      throw error;
    }
  }, []);

  const { data: existingSubjects } = useQuery({
    queryFn: fetchTeacherSubjects,
    queryKey: queryKeys.lectures.subjects,
    networkMode: "offlineFirst",
    enabled: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const resetValues = useCallback(() => {
    setSelectedSubject("");
    setSelectedSubjectId("");
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

      const optimisticSubject = variables.selectedSubject.trim();
      const optimisticClass = variables.selectedClass.trim();

      if (!optimisticSubject || !optimisticClass) {
        return { previousLectures };
      }

      const tempLectureId = "temp-" + new Date().getTime();
      const optimisticDuration =
        variables.duration === -1 ? variables.customDuration.trim() : String(variables.duration);
      const newLecture: LectureWithCount = {
        id: tempLectureId,
        subject: optimisticSubject,
        subjectId: variables.selectedSubjectId,
        courseName: optimisticClass,
        createdAt: new Date().toISOString(),
        studentCount: 0,
        absentCount: 0,
        totalClassStudents: 0,
        status: "active" as const,
        duration: optimisticDuration,
      };

      context.client.setQueryData<LectureWithCount[]>(queryKeys.lectures.teacher, (old) => {
        if (old) {
          return [newLecture, ...old];
        } else {
          return [newLecture];
        }
      });
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
          subject: createdLecture.subject,
          subjectId: createdLecture.subjectId,
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

        context.client.setQueryData<LectureWithCount[]>(queryKeys.lectures.teacher, (old) => {
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

          return replacedTempLecture ? nextLectures : [lectureWithCount, ...nextLectures];
        });
        alert("Success", "Lecture created successfully!", [{ text: "OK" }]);
        await context.client.invalidateQueries({
          queryKey: queryKeys.lectures.teacher,
          refetchType: "none",
        });
      } else {
        context.client.setQueryData(queryKeys.lectures.teacher, onMutateResult.previousLectures);
        if (data) {
          alert("Error", "Failed to create lecture kindly try again", [
            { text: "OK", onPress: selectionAsync },
          ]);
        }
      }
    },
    onError(error, _, onMutateResult, context) {
      alert("Error", error.message || "Failed to create lecture");
      context.client.setQueryData(queryKeys.lectures.teacher, onMutateResult?.previousLectures);
    },
    mutationKey: mutationKeys.lectures.create,
  });

  const handleAddNewClass = () => {
    setShowClassDropdown(false);
    setShowNewClassModal(true);
  };

  const handleAddNewSubject = () => {
    setShowSubjectDropdown(false);
    setShowNewSubjectModal(true);
  };

  const afterClassNameAdded = useCallback(() => {
    setSelectedClass(newClassName);
    setNewClassName("");
    setShowNewClassModal(false);
    setShowClassDropdown(false);
  }, [newClassName]);

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
      const previousClasses = context.client.getQueryData<ClassItem[]>(queryKeys.classes.teacher);
      context.client.setQueryData<ClassItem[]>(queryKeys.classes.teacher, (old) => {
        const newClassNames: ClassItem[] = [];
        if (old) {
          newClassNames.push(...old.filter((classEle) => classEle.name !== newClassNameParam));
        }
        newClassNames.push({
          id: "temp" + new Date().getTime(),
          name: newClassNameParam,
        });
        return newClassNames;
      });
      return {
        previousClasses: previousClasses!,
      };
    },
    onSuccess: async (res, _, onMutateResult, context) => {
      if (res.success) {
        afterClassNameAdded();
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
      // TODO: inline the error there in the input box.
      setShowNewClassModal(false);
      setShowClassDropdown(false);
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

  const { mutateAsync: handleCreateNewSubject } = useMutation<
    AddTeacherSubjectSuccessResponse,
    Error,
    string,
    { previousSubjects: SubjectItem[] } | null
  >({
    mutationKey: mutationKeys.subjects.create,
    mutationFn: async (name: string) => {
      return lectureService.createSubject(name);
    },
    onMutate: async (params, context) => {
      const name = params.trim();
      await context.client.cancelQueries({
        queryKey: queryKeys.lectures.subjects,
      });
      const previousSubjects = context.client.getQueryData<SubjectItem[]>(
        queryKeys.lectures.subjects,
      );
      context.client.setQueryData<SubjectItem[]>(queryKeys.lectures.subjects, (old) => {
        const result: SubjectItem[] = [];
        if (old) {
          result.push(...old.filter((s) => s.name !== name));
        }
        result.push({
          id: "temp" + new Date().getTime(),
          name,
        });
        return result;
      });
      return {
        previousSubjects: previousSubjects!,
      };
    },
    onSuccess: async (res, variables, onMutateResult, context) => {
      if (res.success) {
        await context.client.invalidateQueries({
          queryKey: queryKeys.lectures.subjects,
        });
        // Select the newly created subject
        setSelectedSubject(variables.trim());
        setSelectedSubjectId(res.data?.id || "");
        setShowNewSubjectModal(false);
        setNewSubjectName("");
      } else if (onMutateResult?.previousSubjects) {
        context.client.setQueryData<SubjectItem[]>(
          queryKeys.lectures.subjects,
          onMutateResult.previousSubjects,
        );
        alert("Subject not added successfully");
      }
    },
    onError(error, _, onMutateResult, context) {
      if (onMutateResult?.previousSubjects) {
        context.client.setQueryData<SubjectItem[]>(
          queryKeys.lectures.subjects,
          onMutateResult.previousSubjects,
        );
      }

      if ((error as any).response?.status === 409) {
        setSubjectError("Subject already exists");
      } else {
        setSubjectError(error.message || "Failed to add subject");
      }
    },
  });

  const handleCloseNewSubjectModal = useCallback(() => {
    setShowNewSubjectModal(false);
    setSubjectError("");
    setNewSubjectName("");
  }, []);

  const handleSubjectNameChange = useCallback((name: string) => {
    setNewSubjectName(name);
    setSubjectError("");
  }, []);

  const handleCreateNewSubjectWithCallback = useCallback(
    async (name: string) => {
      if (!name.trim()) {
        setSubjectError("Please enter a subject name");
        return;
      }
      await handleCreateNewSubject(name);
    },
    [handleCreateNewSubject],
  );

  const handleGoBack = () => router.back();

  const handleToggleClassDropdown = () => {
    setShowClassDropdown(!showClassDropdown);
    setShowSubjectDropdown(false);
    setShowDurationDropdown(false);
  };

  const handleToggleSubjectDropdown = () => {
    setShowSubjectDropdown(!showSubjectDropdown);
    setShowClassDropdown(false);
    setShowDurationDropdown(false);
  };

  const handleSelectClass = (className: string) => {
    setSelectedClass(className);
    setShowClassDropdown(false);
  };

  const handleSelectSubject = (name: string) => {
    setSelectedSubject(name);
    const subject = existingSubjects?.find((s) => s.name === name);
    setSelectedSubjectId(subject?.id || "");
    setShowSubjectDropdown(false);
  };

  const handleToggleDurationDropdown = () => {
    setShowDurationDropdown(!showDurationDropdown);
    setShowClassDropdown(false);
    setShowSubjectDropdown(false);
  };

  const handleSelectDuration = (val: number) => {
    setDuration(val);
    setShowDurationDropdown(false);
  };

  const handleCloseNewClassModal = () => setShowNewClassModal(false);

  const minHeightScrollView = useMemo(() => getMinHeightForScrollView(height), [height]);

  return {
    // State
    selectedSubject,
    selectedSubjectId,
    selectedClass,
    duration,
    customDuration,
    setCustomDuration,
    loading,
    existingClasses,
    existingSubjects,
    showClassDropdown,
    showSubjectDropdown,
    showDurationDropdown,
    showNewClassModal,
    showNewSubjectModal,
    newClassName,
    setNewClassName,
    newSubjectName,
    handleSubjectNameChange,
    subjectError,
    minHeightScrollView,

    // Handlers
    handleCreateLecture,
    handleAddNewClass,
    handleAddNewSubject,
    handleCreateNewClass,
    handleCreateNewSubject: handleCreateNewSubjectWithCallback,
    handleGoBack,
    handleToggleClassDropdown,
    handleToggleSubjectDropdown,
    handleSelectClass,
    handleSelectSubject,
    handleToggleDurationDropdown,
    handleSelectDuration,
    handleCloseNewClassModal,
    handleCloseNewSubjectModal,
  };
};
