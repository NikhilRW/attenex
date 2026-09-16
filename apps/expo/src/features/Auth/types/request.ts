import type { UserSchema } from "@/shared/types/common";

export type RegisterGoogleUserResponse = {
  success: boolean;
  message: string;
  user: UserSchema;
  token: string;
};
