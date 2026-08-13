import { fetch as nitroFetch } from "react-native-nitro-fetch";
import * as v from "valibot";

import { BASE_URI } from "@/shared/constants/uri";
import http from "@/shared/utils/http";
import { getUserAuthToken } from "@/shared/utils/user";
import {
  getTeacherAnalyticsResponseSchema,
  GetTeacherAnalyticsResponseType,
} from "@attenex/api-contracts";

export const AnalyticsService = {
  getTeacherAnalytics: async (queryParams: {
    subjectId?: string;
    startDate: string;
    endDate: string;
  }) => {
    const response = await http.get("/api/analytics/teacher", { params: queryParams });
    const result = v.safeParse(getTeacherAnalyticsResponseSchema, response.data);
    if (result.success === false) {
      throw new Error("Invalid response from server");
    }
    return response.data as GetTeacherAnalyticsResponseType;
  },
  getAiAnalytics: async (queryParams: URLSearchParams) => {
    return await nitroFetch(BASE_URI + "/api/analytics/ai?" + queryParams.toString(), {
      stream: true,
      headers: {
        Authorization: `Bearer ${await getUserAuthToken()}`,
      },
    });
  },
};
