import { getStudentAnalyticsRequestSchema } from "@attenex/api-contracts";
import { attendance, classes, db, lectures, subjects, users } from "@config/database_setup";
import { AuthRequest } from "@middleware/auth";
import { logger } from "@utils/logger";
import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { Response } from "express";
import * as v from "valibot";

export const getStudentAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can view student analytics",
      });
    }

    const parsed = v.safeParse(getStudentAnalyticsRequestSchema, req.query);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Invalid query parameters" });
    }

    const { startDate, endDate, subjectId } = parsed.output;
    const userId = req.user.id;
    const [student] = await db
      .select({ className: users.className })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!student?.className) {
      return res.status(200).json({
        success: true,
        data: { subjects: [], lectures: [] },
      });
    }

    const availableSubjects = await db
      .selectDistinct({
        id: subjects.id,
        name: subjects.name,
        teacherName: users.name,
      })
      .from(lectures)
      .innerJoin(classes, eq(lectures.classId, classes.id))
      .innerJoin(subjects, eq(lectures.subjectId, subjects.id))
      .innerJoin(users, eq(lectures.teacherId, users.id))
      .where(and(eq(classes.name, student.className), eq(lectures.status, "ended")))
      .orderBy(asc(subjects.name), asc(users.name));

    const subjectFilter = subjectId ? [eq(lectures.subjectId, subjectId)] : [];
    const lectureStart = sql<string>`coalesce(${lectures.startedAt}, ${lectures.createdAt})`;
    const lectureRows = await db
      .select({
        id: lectures.id,
        subjectId: subjects.id,
        subjectName: subjects.name,
        teacherName: users.name,
        startedAt: lectureStart,
        endedAt: lectures.endedAt,
        duration: lectures.duration,
        attendanceStatus: attendance.status,
      })
      .from(lectures)
      .innerJoin(classes, eq(lectures.classId, classes.id))
      .innerJoin(subjects, eq(lectures.subjectId, subjects.id))
      .innerJoin(users, eq(lectures.teacherId, users.id))

      .leftJoin(
        attendance,
        and(eq(attendance.lectureId, lectures.id), eq(attendance.studentId, userId)),
      )
      .where(
        and(
          eq(classes.name, student.className),
          eq(lectures.status, "ended"),
          ...subjectFilter,
          gte(sql`date(${lectureStart})`, sql`date(${startDate})`),
          lte(sql`date(${lectureStart})`, sql`date(${endDate})`),
        ),
      )
      .orderBy(desc(lectureStart));

    return res.status(200).json({
      success: true,
      data: {
        subjects: availableSubjects.map((subject) => ({
          ...subject,
          teacherName: subject.teacherName ?? "Unknown teacher",
        })),
        lectures: lectureRows.map((lecture) => ({
          id: lecture.id,
          subjectId: lecture.subjectId,
          subjectName: lecture.subjectName,
          teacherName: lecture.teacherName ?? "Unknown teacher",
          startedAt: new Date(lecture.startedAt).toISOString(),
          endedAt: lecture.endedAt?.toISOString() ?? null,
          duration: Number(lecture.duration),
          status: lecture.attendanceStatus === "present" ? "attended" : "missed",
        })),
      },
    });
  } catch (error) {
    logger.error("Error fetching student analytics:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
