import * as v from "valibot";

export const joinLectureRequestSchema = v.object({
  lectureId: v.pipe(v.string(), v.trim(), v.uuid()),
  latitude: v.number(),
  longitude: v.number(),
  rollNo: v.optional(v.pipe(v.string(), v.trim())),
});
export type JoinLectureRequest = v.InferInput<typeof joinLectureRequestSchema>;
