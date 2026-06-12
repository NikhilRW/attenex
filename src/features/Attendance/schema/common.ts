import * as v from "valibot";
import { PASSCODE_LENGTH } from "../constants/studentDashboard.constants";

// want four numbers only passcode
export const passcodeSchema = v.pipe(
  v.string(),
  v.trim(),
  v.length(PASSCODE_LENGTH),
  v.custom((value) => /^\d{4}$/.test(value as string)),
);

export const rollNoSchema = v.pipe(v.string(), v.trim(), v.minLength(1));
