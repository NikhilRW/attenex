import { Lecture } from "@attendance/types/common";
import { User } from "@backend/config/database_setup";
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
  }) => Promise<false | { res: any; lecture: Lecture } | undefined>;
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
  handleUpdateClass: () => Promise<
    { success: boolean; user: Partial<User> } | undefined
  >;
}

export interface UseRollNoManagementReturn {
  rollNo: string;
  showRollNoModal: boolean;
  pendingLecture: Lecture | null;
  setRollNo: Dispatch<SetStateAction<string>>;
  setShowRollNoModal: Dispatch<SetStateAction<boolean>>;
  setPendingLecture: Dispatch<SetStateAction<Lecture | null>>;
  handleRollNoSubmit: (fn: (rollNo: string) => Promise<void>) => void;
  requestRollNo: (lecture: Lecture) => void;
}

export interface UseLectureDetailsParamReturn {
  isFetchingLectureDetails: boolean;
}
