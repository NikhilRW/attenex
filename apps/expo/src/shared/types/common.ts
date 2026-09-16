import * as v from "valibot";

import { userSchema } from "../schemas/auth";

export interface SubjectItem {
  id: string;
  name: string;
}

export type UserSchema = v.InferOutput<typeof userSchema>;
