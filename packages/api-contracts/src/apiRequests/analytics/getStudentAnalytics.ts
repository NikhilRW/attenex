import * as v from "valibot";
import { dateSchema } from "../../common/analytics";

export const getStudentAnalyticsRequestSchema = v.object({
  subjectId: v.optional(v.pipe(v.string(), v.trim(), v.uuid())),
  startDate: dateSchema,
  endDate: dateSchema,
});

export type GetStudentAnalyticsRequestType = v.InferOutput<typeof getStudentAnalyticsRequestSchema>;
