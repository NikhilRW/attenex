import * as v from "valibot";
import { PASSCODE_LENGTH } from "../constants/studentDashboard.constants";

export const passcodeSchema = v.pipe(v.string(), v.trim(), v.length(PASSCODE_LENGTH));

export const classNameSchema = v.pipe(v.string(), v.trim(), v.minLength(1));

export const rollNoSchema = v.pipe(v.string(), v.trim(), v.minLength(1));
