import * as v from "valibot";
import { GetTeacherAnalyticsResponseType } from "../apiResponses/analytics/getTeacherAnalytics";

export const dateSchema = v.pipe(
  v.string(),
  v.regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
);

export type AnalyticsGraphPointType = GetTeacherAnalyticsResponseType["data"]["points"][number];
