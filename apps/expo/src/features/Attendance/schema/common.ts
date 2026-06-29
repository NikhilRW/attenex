import * as v from "valibot";
import { PASSCODE_LENGTH } from "../constants/studentDashboard.constants";

// want four numbers only passcode
export const passcodeSchema = v.pipe(
  v.string(),
  v.trim(),
  v.length(PASSCODE_LENGTH),
  v.custom((value) => /^\d{4}$/.test(value as string)),
);

// simple roll number regex with numbers alphabets(small and capital both) and hyphen

export const rollNoSchema = v.pipe(v.string(), v.trim(), v.minLength(1), v.regex(/^[a-zA-Z0-9-]+$/));