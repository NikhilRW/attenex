import * as v from "valibot";

export const linkedInAuthRequestSchema = v.object({
  code: v.pipe(v.string(), v.minLength(1)),
  redirectUri: v.pipe(v.string(), v.minLength(1)),
});
export type LinkedInAuthRequest = v.InferInput<typeof linkedInAuthRequestSchema>;
