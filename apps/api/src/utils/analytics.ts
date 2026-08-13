import db, { lectures, attendance } from "@config/database_setup";
import { sql, eq, and, gte, lte } from "drizzle-orm";

export const getTeacherAnalyticsGraphPoints = async ({
  startDate,
  endDate,
  subjectId,
  userId,
}: {
  startDate: string;
  endDate: string;
  subjectId: string | undefined;
  userId: string;
}) => {
  const subjectEqualQueryCheck = subjectId ? [eq(lectures.subjectId, subjectId)] : [];

  const response = await db
    .select({
      date: sql`date(${lectures.startedAt})`,
      count: sql`count(${attendance.id})`,
    })
    .from(lectures)
    .innerJoin(attendance, eq(lectures.id, attendance.lectureId))
    .where(
      and(
        ...subjectEqualQueryCheck,
        eq(attendance.status, "present"),
        eq(lectures.teacherId, userId),
        gte(sql`date(${lectures.startedAt})`, sql`date(${startDate})`),
        lte(sql`date(${lectures.startedAt})`, sql`date(${endDate})`),
      ),
    )
    .groupBy(sql`date(${lectures.startedAt})`)
    .orderBy(sql`date(${lectures.startedAt})`);

  return response;
};
