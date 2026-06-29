import { Dispatch, SetStateAction } from "react";
import { Lecture } from "./common";
import { UserSchema } from "@/shared/schemas/auth";

/**
 * Props type definitions for Attendance components
 */

// LectureAttending Components
export interface LectureEndedProps {
  joinedLecture: Lecture;
  passcode: string;
  setPasscode: Dispatch<SetStateAction<string>>;
  handleSubmit: () => void;
  loading: boolean;
}

export interface LectureOngoingProps {
  handleLeaveLecture: () => void;
  joinedLecture: Lecture;
  joining?: boolean;
}

// MainScreen Components
export interface ClassInfoProps {
  user: UserSchema | null;
  setShowClassModal: Dispatch<SetStateAction<boolean>>;
}

export interface NoClassSelectedProps {
  setShowClassModal: Dispatch<SetStateAction<boolean>>;
}

export interface NoLectureFoundProps {
  fetchLectures: () => void;
}

export interface OnGoingLectureProps {
  lecture: Lecture;
  index: number;
  currentLectureJoining: boolean;
  handleJoin: (lecture: Lecture) => Promise<void>;
  lectureHeightRef: React.RefObject<number>;
  joining: boolean;
}

export interface StudentDashboardHeaderProps {
  setShowClassModal: Dispatch<SetStateAction<boolean>>;
  user: UserSchema | null;
}

// Modal Components
export interface ClassUpdateModalProps {
  showClassModal: boolean;
  setShowClassModal: Dispatch<SetStateAction<boolean>>;
  className: string;
  setClassName: Dispatch<SetStateAction<string>>;
  handleUpdateClass: () => void;
  classUpdateLoading: boolean;
}

export interface RollnoModalProps {
  showRollNoModal: boolean;
  setShowRollNoModal: Dispatch<SetStateAction<boolean>>;
  rollNo: string;
  setRollNo: (rollNo: string) => void;
  handleRollNoSubmit: () => void;
  setPendingLecture: Dispatch<SetStateAction<Lecture | null>>;
  errorMessage: string;
}
