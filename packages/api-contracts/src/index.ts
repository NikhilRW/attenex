import * as v from "valibot";

// ==================== Domain Enums ====================

export const userRoleSchema = v.picklist(["student", "teacher", "admin"]);
export type UserRole = v.InferOutput<typeof userRoleSchema>;

export const lectureStatusSchema = v.picklist([
  "scheduled",
  "active",
  "completed",
  "cancelled",
]);
export type LectureStatus = v.InferOutput<typeof lectureStatusSchema>;

export const attendanceStatusSchema = v.picklist([
  "present",
  "absent",
  "late",
  "excused",
]);
export type AttendanceStatus = v.InferOutput<typeof attendanceStatusSchema>;

// ==================== Domain Models ====================

export const userSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.pipe(v.string(), v.trim()),
  email: v.pipe(v.string(), v.email()),
  role: v.nullable(userRoleSchema),
  photoUrl: v.optional(v.nullable(v.string())),
  className: v.optional(v.nullable(v.string())),
  oauthProvider: v.nullable(v.picklist(["google", "linkedin"])),
  isVerified: v.optional(v.boolean()),
  createdAt: v.optional(v.string()),
});
export type User = v.InferOutput<typeof userSchema>;

export const lectureSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  title: v.string(),
  description: v.optional(v.string()),
  teacherId: v.pipe(v.string(), v.uuid()),
  classId: v.pipe(v.string(), v.uuid()),
  startTime: v.string(),
  endTime: v.string(),
  qrCode: v.optional(v.string()),
  status: lectureStatusSchema,
  createdAt: v.string(),
  updatedAt: v.string(),
});
export type Lecture = v.InferOutput<typeof lectureSchema>;

export const attendanceSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  lectureId: v.pipe(v.string(), v.uuid()),
  studentId: v.pipe(v.string(), v.uuid()),
  status: attendanceStatusSchema,
  timestamp: v.string(),
  markedById: v.optional(v.string()),
});
export type Attendance = v.InferOutput<typeof attendanceSchema>;

export const classSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  code: v.string(),
  description: v.optional(v.string()),
  teacherId: v.pipe(v.string(), v.uuid()),
  studentCount: v.number(),
  createdAt: v.string(),
});
export type Class = v.InferOutput<typeof classSchema>;

// ==================== API Response Envelope ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const apiErrorResponseSchema = v.object({
  success: v.literal(false),
  message: v.optional(v.string()),
  error: v.optional(v.string()),
});
export type ApiErrorResponse = v.InferOutput<typeof apiErrorResponseSchema>;

// ==================== Auth Request Schemas ====================

export const emailSignInRequestSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email()),
  password: v.pipe(v.string(), v.minLength(1)),
});
export type EmailSignInRequest = v.InferInput<typeof emailSignInRequestSchema>;

export const emailSignUpRequestSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1)),
  email: v.pipe(v.string(), v.trim(), v.email()),
  password: v.pipe(v.string(), v.minLength(6)),
});
export type EmailSignUpRequest = v.InferInput<typeof emailSignUpRequestSchema>;

export const googleAuthRequestSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1)),
  email: v.pipe(v.string(), v.trim(), v.email()),
  oauth_id: v.pipe(v.string(), v.minLength(1)),
  oauth_provider: v.literal("google"),
  photo_url: v.optional(v.string()),
});
export type GoogleAuthRequest = v.InferInput<typeof googleAuthRequestSchema>;

export const linkedInAuthRequestSchema = v.object({
  code: v.pipe(v.string(), v.minLength(1)),
  redirectUri: v.pipe(v.string(), v.minLength(1)),
});
export type LinkedInAuthRequest = v.InferInput<typeof linkedInAuthRequestSchema>;

// ==================== Auth Response Schemas ====================

export const authSuccessResponseSchema = v.object({
  success: v.literal(true),
  user: userSchema,
  token: v.pipe(v.string(), v.trim(), v.jwsCompact()),
});
export type AuthSuccessResponse = v.InferOutput<typeof authSuccessResponseSchema>;

export const authMessageResponseSchema = v.object({
  success: v.literal(true),
  message: v.string(),
});
export type AuthMessageResponse = v.InferOutput<typeof authMessageResponseSchema>;

// ==================== JWT / Auth Payload ====================

export const jWTTokensSchema = v.object({
  accessToken: v.string(),
  refreshToken: v.string(),
});
export type JWTTokens = v.InferOutput<typeof jWTTokensSchema>;

export const authPayloadSchema = v.object({
  userId: v.pipe(v.string(), v.uuid()),
  email: v.pipe(v.string(), v.email()),
  role: userRoleSchema,
});
export type AuthPayload = v.InferOutput<typeof authPayloadSchema>;
