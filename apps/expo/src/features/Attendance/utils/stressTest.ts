import { Lecture } from "@attendance/types/common";

const STRESS_ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);
const DEFAULT_LECTURE_COUNT = 2000;
const MAX_LECTURE_COUNT = 20000;

interface StudentDashboardStressOptions {
  enabled: boolean;
  lectureCount: number;
}

const toPositiveInt = (value: unknown): number | null => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

const clampLectureCount = (value: number) => {
  return Math.min(Math.max(value, 1), MAX_LECTURE_COUNT);
};

export const getStudentDashboardStressOptions = (params: {
  stress?: string;
  mock?: string;
  count?: string;
  lectures?: string;
  size?: string;
}): StudentDashboardStressOptions => {
  const enabled =
    STRESS_ENABLED_VALUES.has((params.stress || "").toLowerCase()) ||
    STRESS_ENABLED_VALUES.has((params.mock || "").toLowerCase());

  const parsedCount =
    toPositiveInt(params.count) ??
    toPositiveInt(params.lectures) ??
    toPositiveInt(params.size) ??
    DEFAULT_LECTURE_COUNT;

  return {
    enabled,
    lectureCount: clampLectureCount(parsedCount),
  };
};

export const generateMockStudentLectures = (count: number): Lecture[] => {
  const now = Date.now();

  return Array.from({ length: count }, (_, index) => {
    const createdAt = new Date(now - index * 60_000);
    const startedAt = new Date(createdAt.getTime() + 5 * 60_000);
    const active = index % 7 !== 0;

    return {
      id: `stress-student-lecture-${index + 1}`,
      subject: `Stress Lecture ${index + 1}`,
      className: `Class ${(index % 40) + 1}`,
      duration: String(30 + (index % 6) * 10),
      status: active ? "active" : "ended",
      createdAt: createdAt.toISOString(),
      startedAt: startedAt.toISOString(),
      teacherLatitude: "12.9716",
      teacherLongitude: "77.5946",
    };
  });
};
