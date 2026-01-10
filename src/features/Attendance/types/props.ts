import { User } from "@/backend/src/config/database_setup";
import { Dispatch, SetStateAction } from "react";
import { Lecture } from "./common";

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
  handleLeaveLecture: () => Promise<void>;
  joinedLecture: Lecture;
  loading: boolean;
}

// MainScreen Components
export interface ClassInfoProps {
  user: User | null;
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
  loading: boolean;
  handleJoin: (lecture: Lecture) => Promise<void>;
}

export interface StudentDashboardHeaderProps {
  setShowClassModal: Dispatch<SetStateAction<boolean>>;
  user: User | null;
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
  setRollNo: Dispatch<SetStateAction<string>>;
  handleRollNoSubmit: () => void;
  setPendingLecture: Dispatch<SetStateAction<Lecture | null>>;
}
