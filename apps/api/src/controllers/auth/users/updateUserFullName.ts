import db, { users } from "@config/database_setup";
import { AuthRequest } from "@middleware/auth";
import { eq } from "drizzle-orm";
import { Response } from "express";
import * as v from "valibot";
import { updateUserFullNameRequestSchema } from "@attenex/api-contracts";

export const updateUserFullName = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const parsed = v.safeParse(updateUserFullNameRequestSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Fullname is required",
      });
    }

    const { fullName } = parsed.output;

    const dbResponse = await db
      .update(users)
      .set({ name: fullName })
      .where(eq(users.id, userId));

    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Fullname is updated",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Fullname not updated due to some error kindly try again.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update fullname",
    });
  }
};
