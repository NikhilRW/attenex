import { eq } from "drizzle-orm";
import { Response } from "express";
import { db, subjects } from "../../config/database_setup";
import { logger } from "../../utils/logger";
import { AuthRequest } from "@middleware/auth";

export const getTeacherSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const teacherSubjects = await db
      .select({
        id: subjects.id,
        name: subjects.name,
        createdAt: subjects.createdAt,
      })
      .from(subjects)
      .where(eq(subjects.teacherId, userId))
      .orderBy(subjects.name);

    return res.status(200).json({
      success: true,
      data: teacherSubjects,
    });
  } catch (error: any) {
    logger.error("Get teacher subjects error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
