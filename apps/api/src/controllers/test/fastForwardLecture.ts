import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { db, lectures } from "../../config/database_setup";
import { logger } from "../../utils/logger";
import * as v from "valibot";

const fastForwardSchema = v.object({
  lectureId: v.pipe(v.string(), v.trim(), v.uuid()),
  minutesAgo: v.pipe(v.number(), v.minValue(1)),
});

export const fastForwardLecture = async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      success: false,
      message: "Only available in development mode",
    });
  }

  try {
    const parsed = v.safeParse(fastForwardSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Missing or invalid parameters" });
    }

    const { lectureId, minutesAgo } = parsed.output;

    const newStartedAt = new Date(Date.now() - minutesAgo * 60 * 1000);

    await db
      .update(lectures)
      .set({ startedAt: newStartedAt })
      .where(eq(lectures.id, lectureId));

    logger.info(`Fast-forwarded lecture ${lectureId} startedAt to ${newStartedAt.toISOString()} (${minutesAgo} minutes ago)`);

    return res.status(200).json({
      success: true,
      message: `Lecture startedAt set to ${newStartedAt.toISOString()}`,
    });
  } catch (error: any) {
    logger.error("Fast-forward error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
