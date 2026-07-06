import { StaleTime } from "@/shared/constants/tanstackConfig";

export const DURATION_OPTIONS = [
  { label: "30 min", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
  { label: "Custom", value: -1 },
];

export const DEFAULT_LECTURE_ROW_HEIGHT = 236;
export const TEACHER_QUERY_FRESH_MS = StaleTime.SECONDS_30;