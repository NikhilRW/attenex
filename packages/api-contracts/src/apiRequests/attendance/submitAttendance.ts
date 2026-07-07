import * as v from "valibot";

export const submitAttendanceRequestSchema = v.object({
  lectureId: v.pipe(v.string(), v.trim(), v.uuid()),
  latitude: v.number(),
  longitude: v.number(),
  // TODO: make the length to be exactly 4
  passcode: v.pipe(v.string(), v.trim(), v.length(4), v.digits()),
});
export type SubmitAttendanceRequest = v.InferInput<typeof submitAttendanceRequestSchema>;
