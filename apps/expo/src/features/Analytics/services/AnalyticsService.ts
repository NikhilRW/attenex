import http from "@/shared/utils/http";

export const AnalyticsService = {
  getTeacherAnalytics: async () => {
    const response = await http.get("/api/analytics/teacher");
    return response.data;
  },
};
