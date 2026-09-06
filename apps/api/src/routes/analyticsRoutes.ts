import { getStudentAnalytics } from "@controllers/analytics/student/getStudentAnalytics";
import { getAiAnalytics } from "@controllers/analytics/teacher/getAiAnalytics";
import { getTeacherAnalytics } from "@controllers/analytics/teacher/getTeacherAnalytics";
import { authenticate } from "@middleware/auth";
import { Router } from "express";

export const analyticsRouter = Router();
analyticsRouter.get("/student", authenticate, getStudentAnalytics);
analyticsRouter.get("/teacher", authenticate, getTeacherAnalytics);
analyticsRouter.get("/ai", authenticate, getAiAnalytics);
