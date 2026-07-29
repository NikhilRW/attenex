import http from "@/shared/utils/http";

export const AnalyticsService = {
  getTeacherAnalytics: async (queryParams: {
    subjectId?: string;
    startDate: string;
    endDate: string;
  }) => {
    const response = await http.get("/api/analytics/teacher", { params: queryParams });
    return response.data;
  },
};
