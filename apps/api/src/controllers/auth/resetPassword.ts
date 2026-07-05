import { db, users } from "@config/database_setup";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import axios from "axios";
import * as v from "valibot";
import {
  forgotPasswordRequestSchema,
  verifyResetTokenRequestSchema,
  resetPasswordRequestSchema,
} from "@attenex/api-contracts";
import { EMAIL_SERVER_ENDPOINT } from "../../constants/endpoints";

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const parsed = v.safeParse(forgotPasswordRequestSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    const { email } = parsed.output;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent",
      });
    }

    if (user.oauthProvider) {
      return res.status(400).json({
        success: false,
        message: `This account uses ${user.oauthProvider} sign-in. Please use ${user.oauthProvider} to access your account.`,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db
      .update(users)
      .set({
        resetToken: hashedToken,
        resetTokenExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    const resetLink = `https://attenex.vercel.app/auth/reset-password?token=${encodeURIComponent(
      resetToken,
    )}&email=${encodeURIComponent(email)}`;

    const to = email;
    const subject = "Reset Your Password - Attenex";
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <p>Hi ${user.name || "there"},</p>
              <p>We received a request to reset your password for your Attenex account.</p>
              <p>Click the button below to reset your password. This link will expire in <strong>1 hour</strong>.</p>
              <a href="${resetLink}" style="text-align: center;" class="button">Reset Password</a>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account is secure.
              </div>
              <p>Or copy and paste this link into your mobile browser:</p>
              <a style="word-break: break-all; background: white; padding: 10px; border-radius: 5px; font-size: 12px;">${resetLink}</a>
            </div>
            <div class="footer">
              <p>This is an automated email from Attenex. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} Attenex. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    const text = `Hi ${
      user.name || "there"
    },\n\nWe received a request to reset your password for your Attenex account.\n\nClick this link to reset your password (expires in 1 hour):\n${resetLink}\n\nIf you didn't request this, please ignore this email.\n\nThanks,\nThe Attenex Team`;

    await axios.post(EMAIL_SERVER_ENDPOINT, {
      to: email,
      subject: "Reset Your Password - Attenex",
      text,
      html,
    });

    return res.status(200).json({
      message: "If that email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request. Please try again.",
    });
  }
};

export const verifyResetToken = async (req: Request, res: Response) => {
  try {
    const parsed = v.safeParse(verifyResetTokenRequestSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Email and token are required",
      });
    }

    const { email, token } = parsed.output;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.resetToken || !user.resetTokenExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    if (new Date() > new Date(user.resetTokenExpiresAt)) {
      return res.status(400).json({
        success: false,
        message: "Reset link has expired. Please request a new one.",
      });
    }

    const isValid = await bcrypt.compare(token, user.resetToken);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    return res.status(200).json({
      message: "Token is valid",
      userName: user.name,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify reset token",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const parsed = v.safeParse(resetPasswordRequestSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Email, token, and new password are required",
      });
    }

    const { email, token, newPassword } = parsed.output;
// TODO: try to make the response message more generic info not detailed to avoid giving hints to potential attackers about the validity of the email or token.
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.resetToken || !user.resetTokenExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    if (new Date() > new Date(user.resetTokenExpiresAt)) {
      return res.status(400).json({
        success: false,
        message: "Reset link has expired. Please request a new one.",
      });
    }

    const isValid = await bcrypt.compare(token, user.resetToken);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({
        passwordHash,
        resetToken: null,
        resetTokenExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return res.status(200).json({
      message:
        "Password reset successfully. You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to reset password. Please try again.",
    });
  }
};
