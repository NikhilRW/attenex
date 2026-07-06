import * as v from "valibot";

export const createLectureRequestSchema = v.object({
  className: v.pipe(v.string(), v.trim(), v.minLength(1)),
  subjectId: v.optional(v.string()),
  latitude: v.number(),
  longitude: v.number(),
  duration: v.pipe(v.number(), v.minValue(1)),
});
export type CreateLectureRequest = v.InferInput<typeof createLectureRequestSchema>;
