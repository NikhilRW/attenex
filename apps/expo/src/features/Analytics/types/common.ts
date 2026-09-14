import { GetStudentAnalyticsResponseType } from "@attenex/api-contracts";

export type DateFilterType = "7d" | "1m" | "3m" | "1y" | "custom";

export type StudentAnalyticsLecture = GetStudentAnalyticsResponseType["data"]["lectures"][number];
export type StudentAnalyticsSubject = GetStudentAnalyticsResponseType["data"]["subjects"][number];

export type AnalyticsDateRangeParams = {
  selectedDateFilter: DateFilterType;
  customStartDate: Date | null;
  customEndDate: Date | null;
  isCustomDateFilterApplied: boolean;
};

export type GetAnalyticsQueryKeyParamsType = {
  subjectId?: string;
  startDate: string;
  endDate: string;
  selectedDateFilter: DateFilterType;
};

export type GetAiAnalyticsQueryParamsType = {
  subjectId: string | null;
  startDate: string;
  endDate: string;
};
