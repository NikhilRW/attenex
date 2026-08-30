import { SkFont } from "@shopify/react-native-skia";
import { router } from "expo-router";

import { GetTeacherAnalyticsResponseType } from "@attenex/api-contracts";

import { monthLabels } from "../constants/common";
import {
  DateFilterType,
  GetAiAnalyticsQueryParamsType,
  GetAnalyticsQueryKeyParamsType,
} from "../types/common";

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
