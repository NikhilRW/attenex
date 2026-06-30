import * as v from "valibot";
import { userSchema } from "../../common/user";

export const linkedInAuthSuccessResponseSchema = v.object({
  success: v.literal(true),
  user: userSchema,
  token: v.pipe(v.string(), v.trim(), v.jwsCompact()),
});
export type LinkedInAuthSuccessResponse = v.InferOutput<
  typeof linkedInAuthSuccessResponseSchema
>;
