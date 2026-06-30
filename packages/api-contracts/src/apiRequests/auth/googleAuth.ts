import * as v from "valibot";

export const googleAuthRequestSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1)),
  email: v.pipe(v.string(), v.trim(), v.email()),
  oauth_id: v.pipe(v.string(), v.minLength(1)),
  oauth_provider: v.literal("google"),
  photo_url: v.optional(v.string()),
});
export type GoogleAuthRequest = v.InferInput<typeof googleAuthRequestSchema>;
