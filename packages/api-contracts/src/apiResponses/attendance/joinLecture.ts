import * as v from "valibot";
import { userSchema } from "../../common/user";
import { joinLectureAttendanceRecordSchema } from "../../common/attendance";

export const joinLectureSuccessResponseSchema = v.object({
  success: v.literal(true),
  message: v.string(),
  data: joinLectureAttendanceRecordSchema,
  user: userSchema,
});
export type JoinLectureSuccessResponse = v.InferOutput<typeof joinLectureSuccessResponseSchema>;
