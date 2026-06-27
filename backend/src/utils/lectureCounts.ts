import { and, eq, sql } from "drizzle-orm";
import { attendance, db, users } from "../config/database_setup";

export const getLectureCounts = async (lectureId: string, className?: string) => {
  const studentCountRes = await db
    .select({ count: sql<number>`count(*)` })
    .from(attendance)
    .where(eq(attendance.lectureId, lectureId));
  const studentCount = studentCountRes[0]?.count || 0;

  let totalClassStudents = 0;
  if (className) {
    const totalStudentsRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(
        and(
          eq(users.className, className),
          eq(users.role, "student"),
        ),
      );
    totalClassStudents = totalStudentsRes[0]?.count || 0;
  }
  const absentCount = Math.max(0, totalClassStudents - studentCount);

  return { studentCount, absentCount, totalClassStudents };
};
