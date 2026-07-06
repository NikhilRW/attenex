import { and, desc, eq, sql } from "drizzle-orm";
import { Request, Response } from "express";
import {
  attendance,
  classes,
  db,
  lectures,
  subjects,
  users,
} from "../../config/database_setup";
import { logger } from "../../utils/logger";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const getAllLectures = async (req: AuthRequest, res: Response) => {
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
        message: "Only teachers can fetch their lectures",
      });
    }

    // Fetch all lectures for this teacher with class and subject information, sorted by most recent first
    const allLectures = await db
      .select({
        id: lectures.id,
        subject: subjects.name,
        subjectId: lectures.subjectId,
        className: classes.name,
        duration: lectures.duration,
        status: lectures.status,
        createdAt: lectures.createdAt,
        startedAt: lectures.startedAt,
        endedAt: lectures.endedAt,
        teacherLatitude: lectures.teacherLatitude,
        teacherLongitude: lectures.teacherLongitude,
      })
      .from(lectures)
      .leftJoin(classes, eq(lectures.classId, classes.id))
      .leftJoin(subjects, eq(lectures.subjectId, subjects.id))
      .where(eq(lectures.teacherId, userId))
      .orderBy(desc(lectures.createdAt));

    const lecturesWithCounts = await Promise.all(
      allLectures.map(async (lecture) => {
        const studentCountRes = await db
          .select({ count: sql<number>`count(*)` })
          .from(attendance)
          .where(eq(attendance.lectureId, lecture.id));
        const presentCount = Number(studentCountRes[0]?.count || 0);

        let totalClassStudents = 0;
        if (lecture.className) {
          const totalStudentsRes = await db
            .select({ count: sql<number>`count(*)` })
            .from(users)
            .where(
              and(
                eq(users.className, lecture.className),
                eq(users.role, "student"),
              ),
            );
          totalClassStudents = Number(totalStudentsRes[0]?.count || 0);
        }

        const absentCount = totalClassStudents - presentCount;

        return {
          ...lecture,
          studentCount: presentCount,
          totalClassStudents,
          absentCount,
        };
      }),
    );

    logger.info(
      `Fetched ${allLectures.length} lectures for teacher: ${userId}`,
    );

    return res.status(200).json({
      success: true,
      data: lecturesWithCounts,
    });
  } catch (error: any) {
    logger.error("Error fetching lectures:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
