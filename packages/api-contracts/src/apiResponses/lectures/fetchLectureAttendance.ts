import * as v from "valibot";
import { fetchAttendanceRecordSchema } from "../../common/attendance";

export const fetchLectureAttendanceSuccessResponseSchema = v.object({
  success: v.literal(true),
  data: v.object({
    lectureId: v.string(),
    totalStudents: v.number(),
    attendanceCount: v.number(),
    attendance: v.array(fetchAttendanceRecordSchema),
  }),
});
export type FetchLectureAttendanceSuccessResponse = v.InferOutput<typeof fetchLectureAttendanceSuccessResponseSchema>;
