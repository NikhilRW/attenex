import { UserSchema } from "@/shared/schemas/auth";

export type RegisterGoogleUserResponse = {
  success: boolean;
  message: string;
  user: UserSchema;
  token: string;
};