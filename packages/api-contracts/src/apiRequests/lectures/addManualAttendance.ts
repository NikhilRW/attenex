import * as v from "valibot";

export const addManualAttendanceRequestSchema = v.object({
  studentRollNo: v.pipe(v.string(), v.trim(), v.minLength(1)),
});
export type AddManualAttendanceRequest = v.InferInput<typeof addManualAttendanceRequestSchema>;
