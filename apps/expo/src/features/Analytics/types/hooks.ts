import { DateFilterType } from "./common";

export type AnalyticsQueryHookParamsType = {
  subjectId?: string;
  startDate: string;
  endDate: string;
  selectedDateFilter: DateFilterType;
};
