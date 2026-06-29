import db, { subjects } from "@config/database_setup";
import { AuthRequest } from "@middleware/auth";
import { logger } from "@utils/logger";
import { and, eq } from "drizzle-orm";
import { Response } from "express";

export const addTeacherSubject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const name = req.body.name;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }

    const existingSubject = await db
      .select()
      .from(subjects)
      .where(and(eq(subjects.name, name.trim()), eq(subjects.teacherId, userId)))
      .limit(1);

    if (existingSubject[0]) {
      return res.status(409).json({
        success: false,
        message: "Subject already exists",
      });
    }

    const [newSubject] = await db
      .insert(subjects)
      .values({
        name: name.trim(),
        teacherId: userId,
      })
      .returning({ id: subjects.id });

    return res.status(200).json({
      success: true,
      message: "Subject added successfully",
      data: { id: newSubject?.id },
    });
  } catch (error: any) {
    logger.error("Add teacher subject error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
