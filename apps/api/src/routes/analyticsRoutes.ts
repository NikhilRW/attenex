import { getAiAnalytics } from "@controllers/analytics/getAiAnalytics";
import { getTeacherAnalytics } from "@controllers/analytics/getTeacherAnalytics";
import { authenticate } from "@middleware/auth";
import { Router } from "express";

export const analyticsRouter = Router();
analyticsRouter.get("/teacher", authenticate, getTeacherAnalytics);
analyticsRouter.get("/ai", authenticate, getAiAnalytics);
