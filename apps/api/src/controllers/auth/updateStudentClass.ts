import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { classes, db, users } from "../../config/database_setup";
import { logger } from "../../utils/logger";
import * as v from "valibot";
import { updateStudentClassRequestSchema } from "@attenex/api-contracts";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const updateStudentClass = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please login",
      });
    }

    if (userRole !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can update their class",
      });
    }

    const parsed = v.safeParse(updateStudentClassRequestSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Valid class name is required",
      });
    }

    const { className } = parsed.output;

    const classRecords = await db
      .select()
      .from(classes)
      .where(eq(classes.name, className));

    if (classRecords.length > 0) {
      logger.info(
        `Found ${classRecords.length} class(es) with name: ${className}`
      );
    } else {
      logger.info(`No existing class found with name: ${className}`);
    }

    await db
      .update(users)
      .set({ className })
      .where(eq(users.id, userId))
      .returning();

    logger.info(`Updated student ${userId} class to: ${className}`);

    return res.status(200).json({
      success: true,
      message: "Class updated successfully",
    });
  } catch (error: any) {
    logger.error("Error updating student class:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
