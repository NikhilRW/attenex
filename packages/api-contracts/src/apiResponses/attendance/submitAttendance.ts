import * as v from "valibot";
import { submitAttendanceRecordSchema } from "../../common/attendance";

export const submitAttendanceSuccessResponseSchema = v.object({
  success: v.literal(true),
  message: v.string(),
  data: submitAttendanceRecordSchema,
});
export type SubmitAttendanceSuccessResponse = v.InferOutput<typeof submitAttendanceSuccessResponseSchema>;
