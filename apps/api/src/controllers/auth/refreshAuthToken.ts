import db, { users } from "@config/database_setup";
import { logger } from "@utils/logger";
import { generateAuthTokens, getRefreshTokenSecret } from "@utils/tokens";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const refreshAuthToken = async (req: Request, res: Response) => {
  try {
    const authorization = req.headers.authorization;
    const refreshToken = req.headers["refresh-token"];
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

    if (!token || typeof refreshToken !== "string" || !refreshToken) {
      return res.status(401).json({ error: "Missing refresh credentials" });
    }

    const tokenData = jwt.verify(refreshToken, getRefreshTokenSecret());
    if (
      typeof tokenData === "string" ||
      typeof tokenData.id !== "string" ||
      tokenData.token !== token
    ) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const [user] = await db.select().from(users).where(eq(users.id, tokenData.id)).limit(1);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    return res.status(200).json(generateAuthTokens(user));
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.NotBeforeError) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
    logger.error("Token refresh error:", error);
    return res.status(500).json({ error: "Unable to refresh session" });
  }
};
