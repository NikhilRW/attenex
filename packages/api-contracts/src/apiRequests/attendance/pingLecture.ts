import * as v from "valibot";

export const pingLectureRequestSchema = v.object({
  lectureId: v.pipe(v.string(), v.trim(), v.uuid()),
  latitude: v.number(),
  longitude: v.number(),
});
export type PingLectureRequest = v.InferInput<typeof pingLectureRequestSchema>;
