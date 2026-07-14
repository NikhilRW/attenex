import * as v from "valibot";

import { classNameSchema, tokenSchema, userSchema } from "../schemas/auth";
import { resetPasswordQueryParams, verifyEmailQueryParams } from "../schemas/deepLink";
import { bodySchema, endedTrueSchema, lectureIdSchema, titleSchema } from "../schemas/notification";

export const parseResetQueryParams = (data: any) =>
  v.safeParse(resetPasswordQueryParams, data).success;

export const parseVerifyEmailQueryParams = (data: unknown) =>
  v.safeParse(verifyEmailQueryParams, data).success;

export const parseTitle = (data: unknown) => v.safeParse(titleSchema, data).success;
export const parseBody = (data: unknown) => v.safeParse(bodySchema, data).success;

export const parseLectureId = (data: unknown): data is string =>
  v.safeParse(lectureIdSchema, data).success;
export const parseEndedTrue = (data: unknown): data is "true" =>
  v.safeParse(endedTrueSchema, data).success;

export const parseToken = (data: unknown) => v.safeParse(tokenSchema, data).success;

export const parseUser = (data: unknown) => {
  const result = v.safeParse(userSchema, data);
  return result.success;
};

export const parseUserName = (data: unknown) => {
  return v.safeParse(userSchema.entries.name, data).success;
};

export const parseClassName = (data: unknown) => {
  return v.safeParse(classNameSchema, data).success;
};
