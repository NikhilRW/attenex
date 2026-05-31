import * as v from "valibot";
import {
  classNameSchema,
  passcodeSchema,
  rollNoSchema,
} from "../schema/common";

/**
 * Validate passcode format
 * @param passcode - The passcode to validate
 * @returns true if valid, false otherwise
 */
export const validatePasscode = (passcode: string): boolean =>
  v.safeParse(passcodeSchema, passcode).success;

/**
 * Validate class name
 * @param className - The class name to validate
 * @returns true if valid, false otherwise
 */
export const validateClassName = (className: string): boolean =>
  v.safeParse(classNameSchema, className).success;

/**
 * Validate roll number
 * @param rollNo - The roll number to validate
 * @returns true if valid, false otherwise
 */
export const validateRollNo = (rollNo: string): boolean =>
  v.safeParse(rollNoSchema, rollNo).success;
