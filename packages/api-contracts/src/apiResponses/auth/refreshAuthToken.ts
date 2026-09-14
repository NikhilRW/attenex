import * as v from "valibot";

export const refreshAuthTokenSuccessResponseSchema = v.object({
  token: v.pipe(v.string(), v.trim(), v.jwsCompact()),
  refreshToken: v.pipe(v.string(), v.trim(), v.jwsCompact()),
});

export type RefreshAuthTokenSuccessResponse = v.InferOutput<
  typeof refreshAuthTokenSuccessResponseSchema
>;
