import * as v from "valibot";
import { activeLectureItemSchema } from "../../common/lectures";

export const getActiveLecturesSuccessResponseSchema = v.object({
  success: v.literal(true),
  data: v.array(activeLectureItemSchema),
});
export type GetActiveLecturesSuccessResponse = v.InferOutput<typeof getActiveLecturesSuccessResponseSchema>;
