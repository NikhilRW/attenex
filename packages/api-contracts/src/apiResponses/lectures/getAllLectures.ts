import * as v from "valibot";

const lectureWithCountItemSchema = v.object({
  id: v.string(),
  subject: v.nullable(v.string()),
  subjectId: v.nullable(v.string()),
  className: v.nullable(v.string()),
  duration: v.string(),
  status: v.union([v.literal("active"), v.literal("ended")]),
  createdAt: v.nullable(v.string()),
  startedAt: v.nullable(v.string()),
  endedAt: v.nullable(v.string()),
  teacherLatitude: v.string(),
  teacherLongitude: v.string(),
  studentCount: v.number(),
  totalClassStudents: v.number(),
  absentCount: v.number(),
});

export const getAllLecturesSuccessResponseSchema = v.object({
  success: v.literal(true),
  data: v.array(lectureWithCountItemSchema),
});
export type GetAllLecturesSuccessResponse = v.InferOutput<typeof getAllLecturesSuccessResponseSchema>;
