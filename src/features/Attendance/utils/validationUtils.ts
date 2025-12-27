import { PASSCODE_LENGTH } from "@attendance/constants/studentDashboard.constants";

/**
 * Validate passcode format
 * @param passcode - The passcode to validate
 * @returns true if valid, false otherwise
 */
export const validatePasscode = (passcode: string): boolean => {
  return passcode.length === PASSCODE_LENGTH;
};

/**
 * Validate class name
 * @param className - The class name to validate
 * @returns true if valid, false otherwise
 */
export const validateClassName = (className: string): boolean => {
  return className.trim().length > 0;
};

/**
 * Validate roll number
 * @param rollNo - The roll number to validate
 * @returns true if valid, false otherwise
 */
export const validateRollNo = (rollNo: string): boolean => {
  return rollNo.trim().length > 0;
};
