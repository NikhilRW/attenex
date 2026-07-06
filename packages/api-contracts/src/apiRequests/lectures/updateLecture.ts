import * as v from "valibot";

export const updateLectureRequestSchema = v.object({
  duration: v.pipe(v.number(), v.minValue(1)),
});
export type UpdateLectureRequest = v.InferInput<typeof updateLectureRequestSchema>;
