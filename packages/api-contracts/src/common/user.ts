import * as v from "valibot";

export const userRoleSchema = v.picklist(["student", "teacher", "admin"]);
export type UserRole = v.InferOutput<typeof userRoleSchema>;

export const userSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.pipe(v.string(), v.trim()),
  email: v.pipe(v.string(), v.email()),
  role: v.nullable(userRoleSchema),
  photoUrl: v.optional(v.nullable(v.string())),
  className: v.optional(v.nullable(v.string())),
  oauthProvider: v.nullable(v.picklist(["google", "linkedin"])),
  isVerified: v.optional(v.boolean()),
  createdAt: v.optional(v.string()),
});
export type User = v.InferOutput<typeof userSchema>;
