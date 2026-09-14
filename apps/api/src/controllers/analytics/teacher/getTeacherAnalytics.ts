import {
  getTeacherAnalyticsRequestSchema,
  GetTeacherAnalyticsRequestType,
} from "@attenex/api-contracts";
import { AuthRequest } from "@middleware/auth";
import { getTeacherAnalyticsGraphPoints } from "@utils/analytics";
import { Response } from "express";
import * as v from "valibot";

export const getTeacherAnalytics = async (req: AuthRequest, res: Response) => {
  if (!v.safeParse(getTeacherAnalyticsRequestSchema, req.query).success) {
    return res.status(400).json({ success: false, message: "Invalid request body" });
  }

  const { startDate, endDate, subjectId } = req.query as GetTeacherAnalyticsRequestType;
  const userId = req.user?.id || "";

  const response = await getTeacherAnalyticsGraphPoints({
    startDate,
    endDate,
    subjectId,
    userId,
  });

  res.status(200).json({
    success: true,
    data: {
      points: response,
    },
  });
};
