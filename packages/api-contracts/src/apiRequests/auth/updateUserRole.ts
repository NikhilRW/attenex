import * as v from "valibot";
// TODO: remove this comment
import { userRoleSchema } from "../../common/user";

export const updateUserRoleRequestSchema = v.object({
  role: v.picklist(["teacher", "student"]),
});
export type UpdateUserRoleRequest = v.InferInput<typeof updateUserRoleRequestSchema>;
