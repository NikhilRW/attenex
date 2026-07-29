import * as v from "valibot";

export const getTeacherAnalyticsRequestSchema = v.object({
  subjectId: v.optional(v.pipe(v.string(), v.trim(), v.uuid())),
  startDate: v.pipe(v.string(), v.regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)),
  endDate: v.pipe(v.string(), v.regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)),
});
export type GetTeacherAnalyticsRequestType = v.InferInput<typeof getTeacherAnalyticsRequestSchema>;
