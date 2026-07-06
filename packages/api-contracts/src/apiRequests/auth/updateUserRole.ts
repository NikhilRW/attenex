import * as v from "valibot";

export const updateUserRoleRequestSchema = v.object({
  role: v.picklist(["teacher", "student"]),
});
export type UpdateUserRoleRequest = v.InferInput<typeof updateUserRoleRequestSchema>;
