import { User } from "@/backend/src/config/database_setup";

export type RegisterGoogleUserResponse = {
  success: boolean;
  message: string;
  user: User;
  token: string;
};
export type loginUserRequest = {
  email: string;
  password: string;
};
