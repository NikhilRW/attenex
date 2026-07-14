import { Dispatch, SetStateAction } from "react";

import { Lecture } from "@attendance/types/common";
import type { SuccessResponse } from "@attenex/api-contracts";

/**
 * Type definitions for StudentDashboard component
 */

// Lecture status types
export type LectureStatus = "active" | "ended";
export type JoinStatus = "idle" | "joined" | "submitting";

// Location coordinates
export interface LocationCoords {
  latitude: number;
  longitude: number;
}

// Hook return types
export interface UseLectureManagementReturn {
  lectures: Lecture[];
  refreshLectures: () => void;
}

export interface UseAttendanceJoinReturn {
  joinedLecture: Lecture | null;
  status: JoinStatus;
  handleJoin: (lecture: Lecture) => Promise<void>;
  setJoinedLecture: Dispatch<SetStateAction<Lecture | null>>;
  setStatus: Dispatch<SetStateAction<JoinStatus>>;
  proceedWithJoin: (data: {
    lecture: Lecture;
    studentRollNo: string;
  }) => Promise<false | { res: any; lecture: Lecture } | undefined>;
  loadingLectureId: string | undefined;
  loading: boolean;
}

export interface UseAttendanceSubmitReturn {
  passcode: string;
  loading: boolean;
  setPasscode: Dispatch<SetStateAction<string>>;
  handleSubmit: (obj: {
    joinedLecture: Lecture;
    onSuccess: () => void;
  }) => Promise<{ res: any; onSuccess: () => void } | null>;
}

export interface UseSocketManagerReturn {
  lectureStatus: LectureStatus;
  setLectureStatus: Dispatch<SetStateAction<LectureStatus>>;
}

export interface UseClassManagementReturn {
  className: string;
  showClassModal: boolean;
  classUpdateLoading: boolean;
  setClassName: Dispatch<SetStateAction<string>>;
  setShowClassModal: Dispatch<SetStateAction<boolean>>;
  handleUpdateClass: () => Promise<SuccessResponse | undefined>;
}

export interface UseRollNoManagementReturn {
  rollNo: string;
  showRollNoModal: boolean;
  pendingLecture: Lecture | null;
  setRollNo: (rollNo: string) => void;
  setShowRollNoModal: Dispatch<SetStateAction<boolean>>;
  setPendingLecture: Dispatch<SetStateAction<Lecture | null>>;
  handleRollNoSubmit: (fn: (rollNo: string) => Promise<void>) => void;
  requestRollNo: (lecture: Lecture) => void;
  errorMessage: string;
}

export interface UseLectureDetailsParamReturn {
  isFetchingLectureDetails: boolean;
}
