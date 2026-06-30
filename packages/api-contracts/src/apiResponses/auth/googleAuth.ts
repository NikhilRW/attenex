import * as v from "valibot";
import { userSchema } from "../../common/user";

export const googleAuthSuccessResponseSchema = v.object({
  success: v.literal(true),
  message: v.string(),
  user: userSchema,
  token: v.pipe(v.string(), v.trim(), v.jwsCompact()),
});
export type GoogleAuthSuccessResponse = v.InferOutput<
  typeof googleAuthSuccessResponseSchema
>;
