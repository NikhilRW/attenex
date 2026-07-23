import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/constants/queryKeys";

import { AnalyticsService } from "../services/AnalyticsService";

export const useAnalyticsQuery = () => {
  return useQuery({
    queryFn: AnalyticsService.getTeacherAnalytics,
    queryKey: queryKeys.analytics.teacher,
  });
};
