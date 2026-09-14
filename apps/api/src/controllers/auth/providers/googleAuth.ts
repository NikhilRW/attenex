import { users, db } from "@config/database_setup";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { generateAuthTokens } from "@utils/tokens";
import * as v from "valibot";
import { googleAuthRequestSchema } from "@attenex/api-contracts";

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const parsed = v.safeParse(googleAuthRequestSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Name, email, oauth_id, and oauth_provider are required",
      });
    }

    const { name, email, oauth_id, oauth_provider, photo_url } = parsed.output;

    // Check if user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser) {
      const { token, refreshToken } = generateAuthTokens(existingUser);

      return res.status(200).json({
        success: true,
        message: "User with this email already exists",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          photoUrl: existingUser.photoUrl,
          role: existingUser.role,
          className: existingUser.className,
          oauthProvider: existingUser.oauthProvider || null,
        },
        token,
        refreshToken,
      });
    }

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        oauthId: oauth_id,
        oauthProvider: oauth_provider,
        photoUrl: photo_url,
        isVerified: true,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        photoUrl: users.photoUrl,
        role: users.role,
        className: users.className,
        oauthProvider: users.oauthProvider || null,
      });

    const { token, refreshToken } = generateAuthTokens(newUser);

    // Return success response (don't send password hash back)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser[0],
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
    });
  }
};
