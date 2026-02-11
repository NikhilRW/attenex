import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { classes, db } from "../../config/database_setup";
import { logger } from "../../utils/logger";
import { AuthRequest } from "@middleware/auth";

export const getTeacherClasses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const teacherClasses = await db
      .select()
      .from(classes)
      .where(eq(classes.teacherId, userId))
      .orderBy(classes.name);

    return res.status(200).json({
      success: true,
      data: teacherClasses,
    });
  } catch (error: any) {
    logger.error("Get teacher classes error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
