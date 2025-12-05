import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { attendance, db, lectures } from "../../config/database_setup";
import { calculateDistance } from "../../utils/location";
import { logger } from "../../utils/logger";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const submitAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { lectureId, latitude, longitude } = req.body;

    if (!lectureId || !latitude || !longitude) {
      return res
        .status(400)
        .json({ success: false, message: "Missing parameters" });
    }

    // Get lecture
    const lecture = await db.query.lectures.findFirst({
      where: eq(lectures.id, lectureId),
    });

    if (!lecture)
      return res
        .status(404)
        .json({ success: false, message: "Lecture not found" });

    // Verify Location
    const distance = calculateDistance(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(lecture.teacherLatitude!),
      parseFloat(lecture.teacherLongitude!)
    );

    const radius = parseFloat(lecture.geofenceRadius || "200");

    if (distance > radius) {
      return res.status(403).json({
        success: false,
        message: `You are too far from the class (${Math.round(distance)}m).`,
      });
    }

    // Get attendance record to check score
    const attendanceRecord = await db.query.attendance.findFirst({
      where: and(
        eq(attendance.lectureId, lectureId),
        eq(attendance.studentId, userId)
      ),
    });

    if (!attendanceRecord) {
      return res.status(400).json({
        success: false,
        message: "You have not joined this lecture yet.",
      });
    }

    // Check score: need at least 4 out of 7 checks (57%)
    const checkScore = parseInt(attendanceRecord.checkScore || "0");
    const minRequired = 4;

    let finalStatus: "present" | "absent" | "incomplete" = "present";
    let message = "Attendance Marked Present!";

    if (checkScore < minRequired) {
      finalStatus = "incomplete";
      message = `Attendance incomplete - you passed ${checkScore}/7 presence checks (need ${minRequired})`;
    }

    // Update Attendance
    const result = await db
      .update(attendance)
      .set({
        submitTime: new Date(),
        status: finalStatus,
        locationSnapshot: { lat: latitude, lng: longitude, accuracy: 0 },
      })
      .where(
        and(
          eq(attendance.lectureId, lectureId),
          eq(attendance.studentId, userId)
        )
      )
      .returning();

    return res.status(200).json({
      success: true,
      message,
      data: result[0],
    });
  } catch (error: any) {
    logger.error("Submit attendance error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
