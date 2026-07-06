import * as v from "valibot";
import { classItemSchema } from "../../common/classes";

export const getAllClassesSuccessResponseSchema = v.object({
  success: v.literal(true),
  data: v.array(classItemSchema),
});
export type GetAllClassesSuccessResponse = v.InferOutput<typeof getAllClassesSuccessResponseSchema>;
