import { db, users } from "@config/database_setup";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getTransporter } from "@utils/email";
import { logger } from "@utils/logger";

export const emailSignUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    // Validate required fields

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }
    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    } else {
      // Create user
      const passwordHash = bcrypt.hashSync(password, 10); // Hash the password

      const newUser = await db
        .insert(users)
        .values({
          name,
          email,
          passwordHash: passwordHash,
          isVerified: false,
        })
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          photoUrl: users.photoUrl,
          isVerified: users.isVerified,
          createdAt: users.createdAt,
        });
      const token = jwt.sign(
        { id: newUser[0].id, role: newUser[0].role },
        (process.env.JWT_SECRET as string) || "secret",
        { expiresIn: 10 * 24 * 60 * 60 } // 10 days expiration
      );

      // Setup verification token and email
      const tokenExpireMinutes = Number(process.env.OTP_EXPIRE_MINUTES || 10);

      const verificationToken = jwt.sign(
        { userId: newUser[0].id, type: "email_verify" },
        (process.env.JWT_SECRET as string) || "secret",
        { expiresIn: `${tokenExpireMinutes}m` }
      );
      const verificationLink = `https://attenex.vercel.app/auth/verify-email?token=${encodeURIComponent(
        verificationToken
      )}&email=${encodeURIComponent(email)}`;

      // Setup email transporter
      const transporter = getTransporter();

      // Compose HTML and plain text (match style with reset password email)
      const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; background: #f4f6f8; color: #333; }
      .container { max-width: 680px; margin: 0 auto; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; }
      .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; }
      .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      .small { font-size: 13px; color: #555; }
      .link-box { display: inline-block; background: #f5f7fb; padding: 10px; border-radius: 5px; word-break: break-word; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Verify Your Email</h1>
      </div>
      <div class="content">
        <p class="small">Hi ${newUser[0].name || "Friend"},</p>
        <p>Thanks for signing up for Attenex! Click the button below to verify your email address and complete the registration.</p>
        <p style="text-align:center;">
          <a class="button" href="${verificationLink}">Verify Email</a>
        </p>
        <p class="small">If the button doesn't work, copy and paste the link below into your browser:</p>
        <p class="link-box">${verificationLink}</p>
        <p class="small">This link will expire in <strong>${tokenExpireMinutes} minutes</strong>. If you didn't request this, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>This is an automated email from Attenex. Please do not reply.</p>
        <p>&copy; ${new Date().getFullYear()} Attenex. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;

      const text = `Verify your email for Attenex\n\nHi ${
        newUser[0].name || "Friend"
      },\n\nThanks for signing up! Click the link to verify your email: ${verificationLink}\n\nThis link expires in ${tokenExpireMinutes} minutes.\n\nIf you didn't request this, ignore this message.\n\nThanks,\nThe Attenex Team`;

      // Send email (do not block signup; log error if sending fails)
      try {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: "Verify your email — Attenex",
          text,
          html,
        });
      } catch (sendError) {
        logger.error("Failed to send verification email:", sendError);
      }

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
          name: newUser[0].name,
          photoUrl: newUser[0].photoUrl,
          role: newUser[0].role,
        },
        token,
      });
    }
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
    });
  }
};
