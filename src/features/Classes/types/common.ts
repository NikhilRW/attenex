export interface LectureWithCount {
  id: string;
  title: string;
  courseName: string;
  createdAt: string;
  studentCount: number;
  absentCount?: number;
  totalClassStudents?: number;
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
  checkScore: number;
  method: "manual" | "auto" | "oauth";
}

export type FilterType = "all" | "present" | "absent" | "incomplete";

export interface ClassItem {
  id: string;
  name: string;
}


