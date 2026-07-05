import * as v from "valibot";

export const authTypeQuerySchema = v.object({
  authType: v.picklist(["email", "google", "linkedin"]),
});
export type AuthTypeQuery = v.InferInput<typeof authTypeQuerySchema>;
