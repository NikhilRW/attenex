import {
  getTeacherAnalyticsRequestSchema,
  GetTeacherAnalyticsRequestType,
} from "@attenex/api-contracts";
import db, { lectures, attendance } from "@config/database_setup";
import { AuthRequest } from "@middleware/auth";
import { and, lte, gte, eq, sql } from "drizzle-orm";
import { Response } from "express";
import * as v from "valibot";

export const getTeacherAnalytics = async (req: AuthRequest, res: Response) => {
  if (!v.safeParse(getTeacherAnalyticsRequestSchema, req.query).success) {
    return res.status(400).json({ success: false, message: "Invalid request body" });
  }
  const { startDate, endDate, subjectId } = req.query as GetTeacherAnalyticsRequestType;
  const userId = req.user?.id;

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
        gte(lectures.startedAt, sql`date(${startDate})`),
        lte(lectures.startedAt, sql`date(${endDate})`),
      ),
    )
    .groupBy(sql`date(${lectures.startedAt})`)
    .orderBy(sql`date(${lectures.startedAt})`);

  res.status(200).json({ success: true, data: response });
};
