import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/constants/queryKeys";

import { AnalyticsService } from "../services/AnalyticsService";
import { AnalyticsQueryHookParamsType } from "../types/hooks";

export const useAnalyticsQuery = (params: AnalyticsQueryHookParamsType) => {
  return useQuery({
    queryFn: async () => await AnalyticsService.getTeacherAnalytics(params),
    queryKey: queryKeys.analytics.teacher.byOptions(params),
  });
};
