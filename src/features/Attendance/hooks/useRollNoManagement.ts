import { parseRollNo } from "@/features/Attendance/utils/parsers";
import { mutationKeys } from "@/shared/constants/mutationKeys";
import { GarbageTime } from "@/shared/constants/tanstackConfig";
import { useAuthStore } from "@/shared/stores/authStore";
import { Lecture } from "@attendance/types/common";
import { UseRollNoManagementReturn } from "@attendance/types/studentDashboard.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Custom hook to manage roll number handling
 */
export const useRollNoManagement = (): UseRollNoManagementReturn => {
  const [rollNo, setRollNoState] = useState("");
  const [showRollNoModal, setShowRollNoModal] = useState(false);
  const [pendingLecture, setPendingLecture] = useState<Lecture | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { updateUser, user } = useAuthStore();

  const setRollNo = (value: string) => {
    setRollNoState(value);
  };

  const handleRollNoSubmitMutateFn = async (
    onSubmit: (rollNo: string) => Promise<void>,
  ) => {
    if (!parseRollNo(rollNo)) {
      setErrorMessage("Invalid roll number entered");
      return false;
    }
    setShowRollNoModal(false);
    await onSubmit(rollNo.trim());
    return true;
  };

  const { mutate: handleRollNoSubmit } = useMutation({
    mutationFn: handleRollNoSubmitMutateFn,
    gcTime: GarbageTime.SECONDS_30,
    mutationKey: mutationKeys.user.submitRollNo,
    onMutate() {
      const contextRollNo = user?.rollNo;
      updateUser({ rollNo: rollNo.trim() });
      return contextRollNo;
    },
    onSuccess: (data) => {
      if (data === true) {
        setPendingLecture(null);
        setRollNoState("");
        setErrorMessage("");
      }
    },
    onSettled: (_data, error, _, contextRollNo) => {
      if (error) {
        updateUser({ rollNo: contextRollNo });
      }
    },
  });

  const requestRollNo = (lecture: Lecture) => {
    setErrorMessage("");
    setPendingLecture(lecture);
    setShowRollNoModal(true);
  };

  return {
    rollNo,
    showRollNoModal,
    pendingLecture,
    setRollNo,
    setShowRollNoModal,
    setPendingLecture,
    handleRollNoSubmit,
    requestRollNo,
    errorMessage,
  };
};
