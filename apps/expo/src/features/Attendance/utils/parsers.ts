import * as v from "valibot";
import {
  passcodeSchema,
  rollNoSchema,
} from "../schema/common";
import { getStudentLectureSuccessResponseSchema } from "@attenex/api-contracts";

/**
 * Validate passcode format
 * @param passcode - The passcode to validate
 * @returns true if valid, false otherwise
 */
export const parsePasscode = (passcode: string): boolean =>
  v.safeParse(passcodeSchema, passcode).success;

/**
 * Validate roll number
 * @param rollNo - The roll number to validate
 * @returns true if valid, false otherwise
 */
export const parseRollNo = (rollNo: string): boolean =>
  v.safeParse(rollNoSchema, rollNo).success;

export const parseStudentLectureAPIResponseData = (data: unknown) =>
  v.safeParse(getStudentLectureSuccessResponseSchema, data);
