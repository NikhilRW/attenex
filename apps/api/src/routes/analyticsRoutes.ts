import { getTeacherAnalytics } from "@controllers/analytics/getTeacherAnalytics";
import { Router } from "express";

export const analyticsRouter = Router();
analyticsRouter.get("/teacher", getTeacherAnalytics);
