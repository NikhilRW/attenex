import * as v from "valibot";
import { dateSchema } from "../../common/analytics";

export const getTeacherAnalyticsRequestSchema = v.object({
  subjectId: v.optional(v.pipe(v.string(), v.trim(), v.uuid())),
  startDate: dateSchema,
  endDate: dateSchema,
});
export type GetTeacherAnalyticsRequestType = v.InferInput<typeof getTeacherAnalyticsRequestSchema>;
