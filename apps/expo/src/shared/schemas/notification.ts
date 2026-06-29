import * as v from "valibot";

export const titleSchema = v.pipe(v.string(), v.trim(), v.minLength(1));
export const bodySchema = titleSchema;
export const lectureIdSchema = v.pipe(v.string(), v.trim(), v.uuid());
export const endedTrueSchema = v.pipe(v.string(), v.trim(), v.literal("true"));
