import { Request, Response } from "express";
import { classes, db } from "../../config/database_setup";
import { logger } from "../../utils/logger";

export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const allClasses = await db
      .select({ id: classes.id, name: classes.name, teacherId: classes.teacherId })
      .from(classes);
    res.status(200).json({
      success: true,
      data: allClasses,
    });
  } catch (error) {
    logger.error("Error fetching classes:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
