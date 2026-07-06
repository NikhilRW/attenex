import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";
import {
  attendance,
  classes,
  db,
  lectures,
  users,
} from "../../config/database_setup";
import { logger } from "../../utils/logger";
import { LectureParams } from "../../types/params";
import * as v from "valibot";
import { addManualAttendanceRequestSchema } from "@attenex/api-contracts";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const addManualAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { lectureId } = req.params as unknown as LectureParams;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please login",
      });
    }

    if (userRole !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can manually add attendance",
      });
    }

    if (!lectureId) {
      return res.status(400).json({
        success: false,
        message: "Lecture ID and student roll number are required",
      });
    }

    const parsed = v.safeParse(addManualAttendanceRequestSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Lecture ID and student roll number are required",
      });
    }

    const { studentRollNo } = parsed.output;

    const existingLecture = await db
      .select({
        lecture: lectures,
        class: classes,
      })
      .from(lectures)
      .innerJoin(classes, eq(lectures.classId, classes.id))
      .where(and(eq(lectures.id, lectureId), eq(lectures.teacherId, userId)))
      .limit(1);

    if (existingLecture.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found or you don't have permission to modify it",
      });
    }

    const lectureClass = existingLecture[0].class.name;

    const student = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.rollNo, studentRollNo),
          eq(users.className, lectureClass),
          eq(users.role, "student"),
        ),
      )
      .limit(1);

    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Student not found with roll number ${studentRollNo} in class ${lectureClass}`,
      });
    }

    const studentId = student[0].id;

    const existingAttendance = await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.lectureId, lectureId),
          eq(attendance.studentId, studentId),
        ),
      )
      .limit(1);

    if (existingAttendance.length > 0) {
      const updatedAttendance = await db
        .update(attendance)
        .set({
          status: "present",
          method: "manual",
          submitTime: new Date(),
        })
        .where(
          and(
            eq(attendance.lectureId, lectureId),
            eq(attendance.studentId, studentId),
          ),
        )
        .returning();

      logger.info(
        `Updated manual attendance for student: ${studentId} in lecture: ${lectureId}`,
      );

      return res.status(200).json({
        success: true,
        message: "Attendance updated to present",
        data: {
          attendance: {
            id: updatedAttendance[0].id,
            studentId: updatedAttendance[0].studentId,
            studentName: student[0].name,
            studentEmail: student[0].email,
            status: updatedAttendance[0].status,
            method: updatedAttendance[0].method,
          },
        },
      });
    }

    const newAttendance = await db
      .insert(attendance)
      .values({
        lectureId,
        studentId,
        joinTime: new Date(),
        submitTime: new Date(),
        status: "present",
        method: "manual",
        checkScore: "100",
      })
      .returning();

    logger.info(
      `Added manual attendance for student: ${studentId} in lecture: ${lectureId}`,
    );

    return res.status(201).json({
      success: true,
      message: "Manual attendance added successfully",
      data: {
        attendance: {
          id: newAttendance[0].id,
          studentId: newAttendance[0].studentId,
          studentName: student[0].name,
          studentEmail: student[0].email,
          status: newAttendance[0].status,
          method: newAttendance[0].method,
        },
      },
    });
  } catch (error: any) {
    logger.error("Error adding manual attendance:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
