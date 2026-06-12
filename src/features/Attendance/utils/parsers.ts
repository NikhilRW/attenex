import * as v from "valibot";
import { studentLectureAPIResponseSchema } from "../schema/apiResponse";
import {
  passcodeSchema,
  rollNoSchema,
} from "../schema/common";

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
  v.safeParse(studentLectureAPIResponseSchema, data);
