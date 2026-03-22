import { LectureWithCount } from "@classes/types/common";

const STRESS_ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);
const DEFAULT_LECTURE_COUNT = 2000;
const MAX_LECTURE_COUNT = 20000;

export interface TeacherDashboardStressOptions {
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

export const getTeacherDashboardStressOptions = (params: {
  stress?: string;
  mock?: string;
  count?: string;
  lectures?: string;
  size?: string;
}): TeacherDashboardStressOptions => {
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

export const generateMockLectures = (count: number): LectureWithCount[] => {
  const now = Date.now();

  return Array.from({ length: count }, (_, index) => {
    const createdAt = new Date(now - index * 60_000).toISOString();
    const active = index % 5 !== 0;
    const totalClassStudents = 30 + (index % 120);
    const studentCount = Math.max(0, totalClassStudents - (index % 21));
    const absentCount = Math.max(0, totalClassStudents - studentCount);

    return {
      id: `stress-lecture-${index + 1}`,
      title: `Stress Lecture ${index + 1}`,
      courseName: `Class-${(index % 40) + 1}`,
      createdAt,
      studentCount,
      absentCount,
      totalClassStudents,
      status: active ? "active" : "ended",
      duration: String(30 + (index % 6) * 15),
    };
  });
};
