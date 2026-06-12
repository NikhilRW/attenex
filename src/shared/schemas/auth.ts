import * as v from "valibot";

// TODO: make the userSchema extremely strict.
export const userSchema = v.object({
  id: v.pipe(v.string(), v.trim(), v.uuid()),
  name: v.pipe(v.string(), v.trim()),
  email: v.pipe(v.string(), v.trim(), v.email()),
  role: v.optional(
    v.nullable(v.picklist(["student", "teacher"], "Invalid role")),
  ),
  className: v.optional(v.nullable(v.string())),
  photoUrl: v.optional(v.nullable(v.string())),
  oauthProvider: v.nullable(
    v.picklist(["google", "linkedin"], "Invalid OAuth provider"),
  ),
  isVerifired: v.optional(v.boolean()),
  rollNo: v.optional(v.string()),
});

export const tokenSchema = v.pipe(v.string(), v.trim(), v.jwsCompact());
// TODO: move to right place
export type UserSchema = v.InferOutput<typeof userSchema>;

export const classNameSchema = v.pipe(v.string(), v.trim(), v.minLength(1));
