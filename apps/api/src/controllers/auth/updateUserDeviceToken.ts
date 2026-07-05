import db, { users } from "@config/database_setup";
import { AuthRequest } from "@middleware/auth";
import { eq } from "drizzle-orm";
import { Response } from "express";
import * as v from "valibot";
import { updateUserDeviceTokenRequestSchema } from "@attenex/api-contracts";

export const updateUserDeviceToken = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const parsed = v.safeParse(updateUserDeviceTokenRequestSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    }

    const { token } = parsed.output;
    const user = req.user;

    const updatedUser = (
      await db
        .update(users)
        .set({ deviceToken: token })
        .where(eq(users.id, user.id))
        .returning({ deviceToken: users.deviceToken })
    )[0];

    if (updatedUser.deviceToken === token) {
      return res.status(200).json({
        success: true,
        message: "Token updated successfully",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Token did not update successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update device token",
    });
  }
};
