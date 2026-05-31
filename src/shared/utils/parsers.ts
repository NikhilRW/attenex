import * as v from "valibot";
import {
  resetPasswordQueryParams,
  verifyEmailQueryParams,
} from "../schemas/deepLink";

export const parseResetQueryParams = (data: any) =>
  v.safeParse(resetPasswordQueryParams, data).success;

export const parseVerifyEmailQueryParams = (data: unknown) =>
  v.safeParse(verifyEmailQueryParams, data).success;
