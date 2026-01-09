import { Lecture } from "@attendance/types/common";
import { Dispatch, SetStateAction } from "react";

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
  fetchLectures: () => Promise<void>;
  refreshLectures: () => void;
}

export interface UseAttendanceJoinReturn {
  joinedLecture: Lecture | null;
  status: JoinStatus;
  loading: boolean;
  handleJoin: (lecture: Lecture) => Promise<void>;
  handleLeaveLecture: (onLectureLeft: () => void) => Promise<void>;
  setJoinedLecture: Dispatch<SetStateAction<Lecture | null>>;
  setStatus: Dispatch<SetStateAction<JoinStatus>>;
  proceedWithJoin: (data: {
    lecture: Lecture;
    studentRollNo: string;
  }) => Promise<boolean>;
}

export interface UseAttendanceSubmitReturn {
  passcode: string;
  loading: boolean;
  setPasscode: Dispatch<SetStateAction<string>>;
  handleSubmit: (
    joinedLecture: Lecture,
    onSuccess: () => void
  ) => Promise<void>;
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
  handleUpdateClass: () => Promise<void>;
}

export interface UseRollNoManagementReturn {
  rollNo: string;
  showRollNoModal: boolean;
  pendingLecture: Lecture | null;
  setRollNo: Dispatch<SetStateAction<string>>;
  setShowRollNoModal: Dispatch<SetStateAction<boolean>>;
  setPendingLecture: Dispatch<SetStateAction<Lecture | null>>;
  handleRollNoSubmit: (
    onSubmit: (rollNo: string) => Promise<void>
  ) => Promise<void>;
  requestRollNo: (lecture: Lecture) => void;
}

export interface UseLectureDetailsParamReturn {
  fetchingLectureDetails: boolean;
}
