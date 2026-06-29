import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { classes, db, lectures, subjects } from "../../config/database_setup";
import { logger } from "../../utils/logger";
import { generatePasscode } from "../../utils/passcode";
import { sendNotification } from "@utils/sendNotification";
import { scheduleLectureEnd } from "@utils/lecture";

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

    const { className, subjectId, latitude, longitude, duration } = req.body;

    // Look up subject to get the name
    let subjectName = "";
    if (subjectId) {
      const subject = await db
        .select()
        .from(subjects)
        .where(eq(subjects.id, subjectId))
        .limit(1);
      if (subject.length > 0) {
        subjectName = subject[0].name;
      }
    }

    logger.info(
      `Creating lecture for teacher: ${userId}, class: ${className}, subject: ${subjectName}, location: (${latitude}, ${longitude}), duration: ${duration}`,
    )
    // Validate input
    if (!className || !subjectName || !latitude || !longitude || !duration) {
      return res.status(400).json({
        success: false,
        message:
          "Class name, subject, location, and duration are required",
      });
    }

    if (typeof className !== "string") {
      return res.status(400).json({
        success: false,
        message: "Class name must be a string",
      });
    }

    if (className.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Class name cannot be empty",
      });
    }

    // Check if class already exists for this teacher
    const existingClass = await db
      .select()
      .from(classes)
      .where(and(eq(classes.teacherId, userId), eq(classes.name, className)))
      .limit(1);

    let classId: string;
    let classNameStr: string;

    if (existingClass.length > 0) {
      // Use existing class
      classId = existingClass[0].id;
      classNameStr = existingClass[0].name;
      logger.info(
        `Using existing class: ${classNameStr} (ID: ${classId}) for teacher: ${userId}`,
      );
    } else {
      // Create new class with composite key (name, teacherId)
      const newClass = await db
        .insert(classes)
        .values({
          name: className,
          teacherId: userId,
        })
        .returning();

      classId = newClass[0].id;
      classNameStr = newClass[0].name;
      logger.info(
        `Created new class: ${classNameStr} (ID: ${classId}) for teacher: ${userId}`,
      );
    }

    // Create the lecture
    const initialPasscode = generatePasscode();
    const newLectures = await db
      .insert(lectures)
      .values({
        teacherId: userId,
        classId: classId,
        subjectId: subjectId || null,
        teacherLatitude: latitude.toString(),
        teacherLongitude: longitude.toString(),
        duration: duration.toString(),
        status: "active",
        passcode: initialPasscode,
        passcodeUpdatedAt: new Date(),
      })
      .returning();

    const newLecture = newLectures[0];

    logger.info(`Lecture created: ${newLecture.id} by teacher: ${userId}`);
    await sendNotification(className, subjectName, newLecture.id, duration);
    await scheduleLectureEnd(newLecture.id, parseInt(duration, 10));

    return res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      data: {
        lecture: {
          id: newLecture.id,
          subject: subjectName,
          subjectId: newLecture.subjectId,
          className: className,
          duration: newLecture.duration,
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
