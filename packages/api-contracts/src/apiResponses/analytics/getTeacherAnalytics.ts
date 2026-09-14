import * as v from "valibot";
import { dateSchema } from "../../common/analytics";

export const getTeacherAnalyticsResponseSchema = v.object({
  success: v.literal(true),
  data: v.object({
    points: v.array(
      v.object({
        count: v.pipe(v.string(), v.regex(v.DIGITS_REGEX)),
        date: dateSchema,
      }),
    ),
  }),
});

export type GetTeacherAnalyticsResponseType = v.InferInput<
  typeof getTeacherAnalyticsResponseSchema
>;
