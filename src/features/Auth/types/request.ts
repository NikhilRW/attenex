import { User } from "@backend/config/database_setup";

export type RegisterGoogleUserResponse = {
  success: boolean;
  message: string;
  user: User;
  token: string;
};