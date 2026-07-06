import * as v from "valibot";

export const activeLectureItemSchema = v.object({
  id: v.string(),
  subject: v.nullable(v.string()),
  subjectId: v.nullable(v.string()),
  className: v.nullable(v.string()),
  duration: v.string(),
  status: v.union([v.literal("active"), v.literal("ended")]),
  createdAt: v.nullable(v.string()),
  startedAt: v.nullable(v.string()),
  teacherLatitude: v.string(),
  teacherLongitude: v.string(),
});