import db, {
  attendance,
  attendanceAttempts,
  attendancePings,
  classes,
  geofenceLogs,
  lectures,
  subjects,
  users,
} from "@config/database_setup";
import { AuthRequest } from "@middleware/auth";
import { eq, inArray } from "drizzle-orm";
import { Response } from "express";

export const deleteUserAccount = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const teacherLectures = await db
      .select({ id: lectures.id })
      .from(lectures)
      .where(eq(lectures.teacherId, userId));

    const lectureIds = teacherLectures.map((l) => l.id);

    await Promise.all([
      db.delete(attendancePings).where(eq(attendancePings.studentId, userId)),
      db.delete(geofenceLogs).where(eq(geofenceLogs.studentId, userId)),
      db
        .delete(attendanceAttempts)
        .where(eq(attendanceAttempts.studentId, userId)),
      db.delete(attendance).where(eq(attendance.studentId, userId)),
    ]);

    if (lectureIds.length > 0) {
      await Promise.all([
        db
          .delete(attendancePings)
          .where(inArray(attendancePings.lectureId, lectureIds)),
        db
          .delete(geofenceLogs)
          .where(inArray(geofenceLogs.lectureId, lectureIds)),
        db
          .delete(attendanceAttempts)
          .where(inArray(attendanceAttempts.lectureId, lectureIds)),
        db.delete(attendance).where(inArray(attendance.lectureId, lectureIds)),
      ]);
    }

    await db.delete(lectures).where(eq(lectures.teacherId, userId));
    await db.delete(subjects).where(eq(subjects.teacherId, userId));
    await db.delete(classes).where(eq(classes.teacherId, userId));

    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (deletedUser.length > 0) {
      return res.json({
        success: true,
        message: "User account deleted successfully",
      });
    }

    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user account",
    });
  }
};
