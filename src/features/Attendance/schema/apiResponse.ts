import { lectureIdSchema } from "@/shared/schemas/notification";
import * as v from "valibot";

export const studentLectureAPIResponseSchema = v.object({
  id: lectureIdSchema,
  title: v.string(),
  className: v.string(),
  duration: v.number(),
  status: v.custom((val) => val === "active" || val === "ended"),
  createdAt: v.date(),
  startedAt: v.date(),
  teacherLatitude: v.string(),
  teacherLongitude: v.string(),
});
