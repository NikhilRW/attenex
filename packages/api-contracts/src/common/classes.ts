import * as v from "valibot";

export const classItemSchema = v.object({
  id: v.string(),
  name: v.string(),
  teacherId: v.string(),
});
