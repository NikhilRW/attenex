export type DateFilterType = "7d" | "1m" | "3m" | "1y" | "custom";

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
