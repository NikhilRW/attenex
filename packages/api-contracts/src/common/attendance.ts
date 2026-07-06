import * as v from "valibot";

export const attendanceRecordSchema = v.object({
  id: v.string(),
  studentId: v.string(),
  studentName: v.string(),
  studentEmail: v.string(),
  status: v.picklist(["present", "absent", "incomplete"]),
  method: v.picklist(["manual", "auto", "oauth"]),
});


export const absentStudentSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.string(),
  rollNo: v.nullable(v.string()),
});

export const fetchAttendanceRecordSchema = v.object({
  id: v.string(),
  studentId: v.string(),
  studentName: v.string(),
  studentEmail: v.string(),
  studentRollNo: v.nullable(v.string()),
  joinTime: v.nullable(v.string()),
  submitTime: v.nullable(v.string()),
  status: v.union([v.literal("present"), v.literal("absent"), v.literal("incomplete")]),
  checkScore: v.string(),
  method: v.union([v.literal("manual"), v.literal("auto"), v.literal("oauth")]),
  locationSnapshot: v.nullable(v.string()),
});