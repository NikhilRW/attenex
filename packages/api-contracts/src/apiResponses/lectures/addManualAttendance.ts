import * as v from "valibot";
import { attendanceRecordSchema } from "../../common/attendance";

export const addManualAttendanceSuccessResponseSchema = v.object({
  success: v.literal(true),
  message: v.string(),
  data: v.object({
    attendance: attendanceRecordSchema,
  }),
});
export type AddManualAttendanceSuccessResponse = v.InferOutput<typeof addManualAttendanceSuccessResponseSchema>;
