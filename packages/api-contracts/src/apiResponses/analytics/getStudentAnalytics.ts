import * as v from "valibot";

const studentAnalyticsSubjectSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  teacherName: v.string(),
});

const studentAnalyticsLectureSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  subjectId: v.pipe(v.string(), v.uuid()),
  subjectName: v.string(),
  teacherName: v.string(),
  startedAt: v.string(),
  endedAt: v.nullable(v.string()),
  duration: v.number(),
  status: v.picklist(["attended", "missed"]),
});

export const getStudentAnalyticsResponseSchema = v.object({
  success: v.literal(true),
  data: v.object({
    subjects: v.array(studentAnalyticsSubjectSchema),
    lectures: v.array(studentAnalyticsLectureSchema),
  }),
});

export type GetStudentAnalyticsResponseType = v.InferOutput<
  typeof getStudentAnalyticsResponseSchema
>;
