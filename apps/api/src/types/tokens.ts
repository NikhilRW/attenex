import { User } from "@config/database_setup";
import { SignOptions } from "jsonwebtoken";

export type AccessTokenOptions = {
  expiresIn?: SignOptions["expiresIn"];
  secret?: string;
};
export type AuthTokenOptions = {
  accessTokenExpiresIn?: SignOptions["expiresIn"];
  refreshTokenExpiresIn?: SignOptions["expiresIn"];
};
export type AuthTokenPayload = Pick<User, "id" | "role">;
