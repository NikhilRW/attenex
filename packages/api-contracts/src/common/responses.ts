import * as v from "valibot";

export const successResponseSchema = v.object({
  success: v.literal(true),
  message: v.string(),
});
export type SuccessResponse = v.InferOutput<typeof successResponseSchema>;
