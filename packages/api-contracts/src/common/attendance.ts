import * as v from "valibot";

export const attendanceRecordSchema = v.object({
  id: v.string(),
  studentId: v.string(),
  studentName: v.string(),
  studentEmail: v.string(),
  status: v.string(),
  method: v.string(),
});
