import { getTeacherAnalytics } from "@controllers/getTeacherAnalytics";
import { Router } from "express";

export const analyticsRouter = Router();
analyticsRouter.post("/teacher", getTeacherAnalytics);
