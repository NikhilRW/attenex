import * as v from "valibot";
import {
  resetPasswordQueryParams,
  verifyEmailQueryParams,
} from "../schemas/deepLink";
import {
  bodySchema,
  endedTrueSchema,
  lectureIdSchema,
  titleSchema,
} from "../schemas/notification";

export const parseResetQueryParams = (data: any) =>
  v.safeParse(resetPasswordQueryParams, data).success;

export const parseVerifyEmailQueryParams = (data: unknown) =>
  v.safeParse(verifyEmailQueryParams, data).success;

export const parseTitle = (data: unknown) =>
  v.safeParse(titleSchema, data).success;
export const parseBody = (data: unknown) =>
  v.safeParse(bodySchema, data).success;

export const parseLectureId = (data: unknown) =>
  v.safeParse(lectureIdSchema, data).success;
export const parseEndedTrue = (data: unknown) =>
  v.safeParse(endedTrueSchema, data).success;
