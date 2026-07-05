import * as v from "valibot";

export const updateUserFullNameRequestSchema = v.object({
  fullName: v.pipe(v.string(), v.trim(), v.minLength(1)),
});
export type UpdateUserFullNameRequest = v.InferInput<typeof updateUserFullNameRequestSchema>;
