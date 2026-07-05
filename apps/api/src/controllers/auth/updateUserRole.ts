import { db, users } from "@config/database_setup";
import { AuthRequest } from "@middleware/auth";
import { eq } from "drizzle-orm";
import { Response } from "express";
import * as v from "valibot";
import { updateUserRoleRequestSchema } from "@attenex/api-contracts";

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const parsed = v.safeParse(updateUserRoleRequestSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be either 'teacher' or 'student'",
      });
    }

    const { role } = parsed.output;

    const updatedUsers = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUsers.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user role. Please try again.",
    });
  }
};
