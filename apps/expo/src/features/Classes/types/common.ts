import { DeleteLectureSuccessResponse, GetAllLecturesSuccessResponse } from "@attenex/api-contracts";

export interface LectureWithCount {
  id: string;
  subject: string;
  courseName: string;
  createdAt: string;
  studentCount: number;
  absentCount?: number;
  totalClassStudents?: number;
  subjectId?: string | null;
  status: "active" | "ended";
  duration: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentRollNo: string | null;
  status: "present" | "absent" | "incomplete";
  joinTime: string | null;
  submitTime: string | null;
  checkScore: string;
  method: "manual" | "auto" | "oauth";
}

export type FilterType = "all" | "present" | "absent" | "incomplete";

export interface ClassItem {
  id: string;
  name: string;
}

export interface SubjectItem {
  id: string;
  name: string;
}
export type LectureApiItem = GetAllLecturesSuccessResponse["data"][number];

export type LectureMutationResponse = DeleteLectureSuccessResponse;

export type UpdateLectureVariables = {
  lectureId: string;
  duration: number;
};

export type LectureRollbackContext = {
  previousLectures?: LectureWithCount[];
} | null;
