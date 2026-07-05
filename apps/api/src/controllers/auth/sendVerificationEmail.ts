import { db, users } from "@config/database_setup";
import { sendVerificationEmail } from "@utils/email";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import * as v from "valibot";
import { sendVerificationEmailRequestSchema } from "@attenex/api-contracts";

export const sendVerificationEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    const parsed = v.safeParse(sendVerificationEmailRequestSchema, req.body);
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
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified kindly sign up",
      });
    }

    await sendVerificationEmail({
      email: user.email,
      id: user.id,
      name: user.name,
    });

    return res.status(200).json({
      success: true,
      message: "Email has been sent",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send verification email",
    });
  }
};
