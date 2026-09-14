import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/constants/queryKeys";

import { AnalyticsService } from "../services/AnalyticsService";
import { AnalyticsQueryHookParamsType } from "../types/hooks";

export const useStudentAnalyticsQuery = (params: AnalyticsQueryHookParamsType) => {
  return useQuery({
    queryKey: queryKeys.analytics.student.byOptions(params),
    queryFn: () =>
      AnalyticsService.getStudentAnalytics({
        subjectId: params.subjectId,
        startDate: params.startDate,
        endDate: params.endDate,
      }),
    placeholderData: (previousData) => previousData,
  });
};
