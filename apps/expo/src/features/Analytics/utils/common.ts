import { SkFont } from "@shopify/react-native-skia";
import { router } from "expo-router";

import { GetTeacherAnalyticsResponseType } from "@attenex/api-contracts";
import { SubjectItem } from "@shared/types/common";

import { ALL_SUBJECTS_ID, ALL_SUBJECTS_LABEL, monthLabels } from "../constants/common";
import {
  AnalyticsDateRangeParams,
  DateFilterType,
  GetAiAnalyticsQueryParamsType,
  GetAnalyticsQueryKeyParamsType,
  StudentAnalyticsSubject,
} from "../types/common";

const studentAnalyticsDateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const studentAnalyticsTimeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

export const getTextWidth = (font: SkFont, text: string) => {
  "worklet";
  return font.measureText(text).width;
};

export const getStartDateBasedOnFilter = (date: Date, filter: DateFilterType) => {
  switch (filter) {
    case "7d":
      date.setDate(date.getDate() - 7);
      break;
    case "1m":
      date.setMonth(date.getMonth() - 1);
      break;
    case "3m":
      date.setMonth(date.getMonth() - 3);
      break;
    case "1y":
      date.setFullYear(date.getFullYear() - 1);
      break;
    case "custom":
      break;
  }
  return date;
};

export const getNormalizedDate = (date: Date) => {
  // Format as YYYY-MM-DD to be postgres sql compatible which is used in the backend
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getCurrentDate = () => new Date();

export const getAnalyticsDateRange = ({
  selectedDateFilter,
  customStartDate,
  customEndDate,
  isCustomDateFilterApplied,
}: AnalyticsDateRangeParams) => ({
  startDate:
    selectedDateFilter === "custom" && customStartDate && isCustomDateFilterApplied
      ? getNormalizedDate(customStartDate)
      : getNormalizedDate(getStartDateBasedOnFilter(getCurrentDate(), selectedDateFilter)),
  endDate:
    selectedDateFilter === "custom" && customEndDate && isCustomDateFilterApplied
      ? getNormalizedDate(customEndDate)
      : getNormalizedDate(getCurrentDate()),
});

export const getCustomDateRangeError = (startDate: Date | null, endDate: Date | null) => {
  if (!startDate || !endDate) {
    return "Start and End date cannot be empty.";
  }
  if (endDate.getTime() < startDate.getTime()) {
    return "End date cannot be earlier than start date.";
  }
  return null;
};

export const getSubjectOptionsWithAll = (subjects: SubjectItem[]): SubjectItem[] => [
  { id: ALL_SUBJECTS_ID, name: ALL_SUBJECTS_LABEL },
  ...subjects,
];

export const getStudentSubjectOptions = (subjects: StudentAnalyticsSubject[]): SubjectItem[] =>
  getSubjectOptionsWithAll(
    subjects.map((subject) => ({
      id: subject.id,
      name: `${subject.name} · ${subject.teacherName}`,
    })),
  );

export const getSelectedSubjectLabel = (options: SubjectItem[], selectedSubjectId?: string) =>
  options.find((subject) => subject.id === selectedSubjectId)?.name ?? ALL_SUBJECTS_LABEL;

export const formatStudentAnalyticsDate = (startedAt: string) =>
  studentAnalyticsDateFormatter.format(new Date(startedAt));

export const formatStudentAnalyticsTime = (startedAt: string) =>
  studentAnalyticsTimeFormatter.format(new Date(startedAt));

export const getAnalyticsGraphPoints = (data: GetTeacherAnalyticsResponseType | undefined) => {
  if (data === undefined) {
    return [];
  }
  return (data.data.points || []).map(({ count, date }) => ({
    value: parseInt(count),
    date: new Date(date),
  }));
};

export const getQueryKeyForTeacherAnalytics = (params: GetAnalyticsQueryKeyParamsType) => {
  const preset = ["analytics", "teacher", params.selectedDateFilter, params.subjectId || "all"];
  if (params.selectedDateFilter === "custom") {
    return preset.concat([params.startDate, params.endDate]);
  }
  return preset;
};

export const getQueryKeyForStudentAnalytics = (params: GetAnalyticsQueryKeyParamsType) =>
  ["analytics", "student", params] as const;

export const buildQueryParamsForTeacherAnalytics = (data: GetAiAnalyticsQueryParamsType) => {
  const params = new URLSearchParams();
  const { subjectId, startDate, endDate } = data;
  if (subjectId) {
    params.append("subjectId", subjectId);
  }
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  return params;
};

export const goToCreateLectureScreen = () => {
  router.navigate("/create-lecture");
};

export const formatReadableDate = (date: Date) => {
  return `${date.getDate()} ${monthLabels[date.getMonth()]} ${date.getFullYear()}`;
};
