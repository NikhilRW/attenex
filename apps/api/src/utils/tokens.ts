import jwt, { type SignOptions } from "jsonwebtoken";
import { AccessTokenOptions, AuthTokenOptions, AuthTokenPayload } from "../types/tokens";

export const getAccessTokenSecret = () => process.env.JWT_SECRET || "secret";
export const getRefreshTokenSecret = () => process.env.JWT_REFRESH_SECRET || "refresh";

export const generateAccessToken = (
  { id, role }: AuthTokenPayload,
  { expiresIn = 10 * 60, secret = getAccessTokenSecret() }: AccessTokenOptions = {},
) => jwt.sign({ id, role }, secret, { expiresIn });

export const generateRefreshToken = (
  { id, role }: AuthTokenPayload,
  token: string,
  expiresIn: SignOptions["expiresIn"] = 30 * 24 * 60 * 60,
) => jwt.sign({ token, id, role }, getRefreshTokenSecret(), { expiresIn });

export const generateAuthTokens = (
  user: AuthTokenPayload,
  { accessTokenExpiresIn, refreshTokenExpiresIn }: AuthTokenOptions = {},
) => {
  const token = generateAccessToken(user, { expiresIn: accessTokenExpiresIn });
  const refreshToken = generateRefreshToken(user, token, refreshTokenExpiresIn);

  return { token, refreshToken };
};
