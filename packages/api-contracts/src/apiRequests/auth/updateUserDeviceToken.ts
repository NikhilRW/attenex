import * as v from "valibot";

export const updateUserDeviceTokenRequestSchema = v.object({
  token: v.nullable(v.string()),
});
export type UpdateUserDeviceTokenRequest = v.InferInput<typeof updateUserDeviceTokenRequestSchema>;
