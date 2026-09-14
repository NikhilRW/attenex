import {
  AnalyticsGraphPointType,
  getAiAnalyticsRequestSchema,
  GetTeacherAnalyticsRequestType,
} from "@attenex/api-contracts";
import { AuthRequest } from "@middleware/auth";
import { getStreamingAiAnalysisText, consumeStreamingAnalysis } from "@utils/ai";
import { getTeacherAnalyticsGraphPoints } from "@utils/analytics";
import { logger } from "@utils/logger";
import { Response } from "express";
import * as v from "valibot";

export const getAiAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    if (!v.safeParse(getAiAnalyticsRequestSchema, req.query).success) {
      return res.status(400).json({ success: false, message: "Invalid request body" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const userId = req.user?.id;
    const { startDate, endDate, subjectId } = req.query as GetTeacherAnalyticsRequestType;

    const points = await getTeacherAnalyticsGraphPoints({
      startDate,
      endDate,
      subjectId,
      userId,
    });
    const stream = await getStreamingAiAnalysisText(points as AnalyticsGraphPointType[]);

    await consumeStreamingAnalysis(stream, (content) => {
      if (res.closed) return;
      res.write(`${content}`);
    });

    return res.end();
  } catch (error) {
    logger.info("Error occured while fetching AI repsonse : ", error);
    return res.end();
  }
};
