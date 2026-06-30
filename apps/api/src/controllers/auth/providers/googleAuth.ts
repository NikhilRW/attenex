import { users, db } from "@config/database_setup";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
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
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let token;

    if (existingUser.length > 0) {
      token = jwt.sign(
        { id: existingUser[0].id, role: existingUser[0].role },
        (process.env.JWT_SECRET as string) || "secret",
        { expiresIn: 10 * 24 * 60 * 60 } // 10 days expiration
      );
      return res.status(200).json({
        success: true,
        message: "User with this email already exists",
        user: {
          id: existingUser[0].id,
          name: existingUser[0].name,
          email: existingUser[0].email,
          photoUrl: existingUser[0].photoUrl,
          role: existingUser[0].role,
          className: existingUser[0].className,
          oauthProvider: existingUser[0].oauthProvider || null,
        },
        token,
      });
    }

    // Create user
    const newUser = await db
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

    token = jwt.sign(
      { id: newUser[0].id, role: newUser[0].role },
      (process.env.JWT_SECRET as string) || "secret",
      { expiresIn: 30 * 24 * 60 * 60 } // 30 days expiration
    );

    // Return success response (don't send password hash back)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser[0],
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
    });
  }
};
