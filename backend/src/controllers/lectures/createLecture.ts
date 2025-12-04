import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { classes, db, lectures } from "../../config/database_setup";
import { logger } from "../../utils/logger";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const createLecture = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Verify user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please login",
      });
    }

    // Verify user is a teacher
    if (userRole !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can create lectures",
      });
    }

    const { className, lectureName } = req.body;

    // Validate input
    if (!className || !lectureName) {
      return res.status(400).json({
        success: false,
        message: "Class name and lecture name are required",
      });
    }

    if (typeof className !== "string" || typeof lectureName !== "string") {
      return res.status(400).json({
        success: false,
        message: "Class name and lecture name must be strings",
      });
    }

    if (className.trim().length === 0 || lectureName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Class name and lecture name cannot be empty",
      });
    }

    // Check if class already exists for this teacher
    const existingClass = await db
      .select()
      .from(classes)
      .where(and(eq(classes.teacherId, userId), eq(classes.name, className)))
      .limit(1);

    let classId: string;

    if (existingClass.length > 0) {
      // Use existing class
      classId = existingClass[0].id;
      logger.info(`Using existing class: ${classId} for teacher: ${userId}`);
    } else {
      // Create new class
      const newClass = await db
        .insert(classes)
        .values({
          name: className,
          teacherId: userId,
        })
        .returning();

      classId = newClass[0].id;
      logger.info(`Created new class: ${classId} for teacher: ${userId}`);
    }

    // Generate a random 4-digit passcode
    const passcode = Math.floor(1000 + Math.random() * 9000).toString();

    // Set passcode expiration to 1 hour from now
    const passcodeExpiresAt = new Date();
    passcodeExpiresAt.setHours(passcodeExpiresAt.getHours() + 1);

    // Create the lecture
    const newLectures = await db
      .insert(lectures)
      .values({
        teacherId: userId,
        classId: classId,
        title: lectureName,
        passcode: passcode,
        passcodeExpiresAt: passcodeExpiresAt,
        status: "active",
      })
      .returning();

    const newLecture = newLectures[0];

    logger.info(`Lecture created: ${newLecture.id} by teacher: ${userId}`);

    return res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      data: {
        lecture: {
          id: newLecture.id,
          title: newLecture.title,
          className: className,
          passcode: newLecture.passcode,
          status: newLecture.status,
          createdAt: newLecture.createdAt,
        },
      },
    });
  } catch (error: any) {
    logger.error("Error creating lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
