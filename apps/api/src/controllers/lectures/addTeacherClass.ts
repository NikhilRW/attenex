import db, { classes } from "@config/database_setup";
import { AuthRequest } from "@middleware/auth";
import { logger } from "@utils/logger";
import { and, eq } from "drizzle-orm";
import { Response } from "express";
import * as v from "valibot";
import { addTeacherClassRequestSchema } from "@attenex/api-contracts";

export const addTeacherClass = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const parsed = v.safeParse(addTeacherClassRequestSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Class name is required",
      });
    }

    const { className } = parsed.output;

    const existingClass = await db
      .select()
      .from(classes)
      .where(and(eq(classes.name, className), eq(classes.teacherId, userId)))
      .limit(1);

    if (existingClass[0]) {
      return res.status(409).json({
        success: false,
        message: "Class already exists",
      });
    }

    await db.insert(classes).values({
      name: className,
      teacherId: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Class added successfully",
    });
  } catch (error: any) {
    logger.error("Add teacher classes error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
