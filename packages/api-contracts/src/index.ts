// common
export type { SuccessResponse } from "./common/responses";

// apiRequests - auth
export { emailSignInRequestSchema } from "./apiRequests/auth/emailSignIn";
export { emailSignUpRequestSchema } from "./apiRequests/auth/emailSignUp";
export { googleAuthRequestSchema } from "./apiRequests/auth/googleAuth";
export { linkedInAuthRequestSchema } from "./apiRequests/auth/linkedInAuth";
export { authTypeQuerySchema } from "./apiRequests/auth/signInUser";
export { verifyUserRequestSchema } from "./apiRequests/auth/verifyUser";
export { sendVerificationEmailRequestSchema } from "./apiRequests/auth/sendVerificationEmail";
export { forgotPasswordRequestSchema } from "./apiRequests/auth/forgotPassword";
export { verifyResetTokenRequestSchema } from "./apiRequests/auth/verifyResetToken";
export { resetPasswordRequestSchema } from "./apiRequests/auth/resetPassword";
export { updateStudentClassRequestSchema } from "./apiRequests/auth/updateStudentClass";
export { updateUserDeviceTokenRequestSchema } from "./apiRequests/auth/updateUserDeviceToken";
export { updateUserRoleRequestSchema } from "./apiRequests/auth/updateUserRole";
export { updateUserFullNameRequestSchema } from "./apiRequests/auth/users/updateUserFullName";

// apiResponses - auth
export { emailSignInSuccessResponseSchema } from "./apiResponses/auth/emailSignIn";
export { emailSignUpSuccessResponseSchema } from "./apiResponses/auth/emailSignUp";
export { googleAuthSuccessResponseSchema } from "./apiResponses/auth/googleAuth";
export { linkedInAuthSuccessResponseSchema } from "./apiResponses/auth/linkedInAuth";
export { verifyUserSuccessResponseSchema } from "./apiResponses/auth/verifyUser";
export { sendVerificationEmailSuccessResponseSchema } from "./apiResponses/auth/sendVerificationEmail";
export { forgotPasswordSuccessResponseSchema } from "./apiResponses/auth/forgotPassword";
export { verifyResetTokenSuccessResponseSchema } from "./apiResponses/auth/verifyResetToken";
export { resetPasswordSuccessResponseSchema } from "./apiResponses/auth/resetPassword";
export { deleteUserAccountSuccessResponseSchema } from "./apiResponses/auth/deleteUserAccount";
export { updateStudentClassSuccessResponseSchema } from "./apiResponses/auth/updateStudentClass";
export { updateUserDeviceTokenSuccessResponseSchema } from "./apiResponses/auth/updateUserDeviceToken";
export { updateUserRoleSuccessResponseSchema } from "./apiResponses/auth/updateUserRole";
export { updateUserFullNameSuccessResponseSchema } from "./apiResponses/auth/users/updateUserFullName";

// apiRequests - lectures
export { addTeacherClassRequestSchema } from "./apiRequests/lectures/addTeacherClass";
export { addTeacherSubjectRequestSchema } from "./apiRequests/lectures/addTeacherSubject";
export { createLectureRequestSchema } from "./apiRequests/lectures/createLecture";
export { addManualAttendanceRequestSchema } from "./apiRequests/lectures/addManualAttendance";
export { updateLectureRequestSchema } from "./apiRequests/lectures/updateLecture";

// apiRequests - analytics
export { getTeacherAnalyticsRequestSchema } from "./apiRequests/analytics/getTeacherAnalytics";
export type { GetTeacherAnalyticsRequestType } from "./apiRequests/analytics/getTeacherAnalytics";
export { getAiAnalyticsRequestSchema } from "./apiRequests/analytics/getAiAnalytics";
export { GetAiAnalyticsRequestType } from "./apiRequests/analytics/getAiAnalytics";

// apiResponses - lectures
export { addTeacherClassSuccessResponseSchema } from "./apiResponses/lectures/addTeacherClass";
export type { AddTeacherSubjectSuccessResponse } from "./apiResponses/lectures/addTeacherSubject";
export { addTeacherSubjectSuccessResponseSchema } from "./apiResponses/lectures/addTeacherSubject";
export { createLectureResponseSchema } from "./apiResponses/lectures/createLecture";
export type { DeleteLectureSuccessResponse } from "./apiResponses/lectures/deleteLecture";
export { deleteLectureSuccessResponseSchema } from "./apiResponses/lectures/deleteLecture";
export type { AddManualAttendanceSuccessResponse } from "./apiResponses/lectures/addManualAttendance";
export { addManualAttendanceSuccessResponseSchema } from "./apiResponses/lectures/addManualAttendance";
export type { EndLectureSuccessResponse } from "./apiResponses/lectures/endLecture";
export { endLectureSuccessResponseSchema } from "./apiResponses/lectures/endLecture";
export type { FetchLectureAttendanceSuccessResponse } from "./apiResponses/lectures/fetchLectureAttendance";
export { fetchLectureAttendanceSuccessResponseSchema } from "./apiResponses/lectures/fetchLectureAttendance";
export type { GetActiveLecturesSuccessResponse } from "./apiResponses/lectures/getActiveLectures";
export { getActiveLecturesSuccessResponseSchema } from "./apiResponses/lectures/getActiveLectures";
export type { GetAllClassesSuccessResponse } from "./apiResponses/lectures/getAllClasses";
export { getAllClassesSuccessResponseSchema } from "./apiResponses/lectures/getAllClasses";
export type { GetAllLecturesSuccessResponse } from "./apiResponses/lectures/getAllLectures";
export { getAllLecturesSuccessResponseSchema } from "./apiResponses/lectures/getAllLectures";
export type { GetPasscodeSuccessResponse } from "./apiResponses/lectures/getPasscode";
export { getPasscodeSuccessResponseSchema } from "./apiResponses/lectures/getPasscode";
export type { GetStudentLectureSuccessResponse } from "./apiResponses/lectures/getStudentLecture";
export { getStudentLectureSuccessResponseSchema } from "./apiResponses/lectures/getStudentLecture";
export type { GetStudentLecturesSuccessResponse } from "./apiResponses/lectures/getStudentLectures";
export { getStudentLecturesSuccessResponseSchema } from "./apiResponses/lectures/getStudentLectures";
export type { GetTeacherClassesSuccessResponse } from "./apiResponses/lectures/getTeacherClasses";
export { getTeacherClassesSuccessResponseSchema } from "./apiResponses/lectures/getTeacherClasses";
export type { GetTeacherSubjectsSuccessResponse } from "./apiResponses/lectures/getTeacherSubjects";
export { getTeacherSubjectsSuccessResponseSchema } from "./apiResponses/lectures/getTeacherSubjects";
export type { UpdateLectureSuccessResponse } from "./apiResponses/lectures/updateLecture";
export { updateLectureSuccessResponseSchema } from "./apiResponses/lectures/updateLecture";
export type { GetTeacherAnalyticsResponseType } from "./apiResponses/analytics/getTeacherAnalytics";
export { getTeacherAnalyticsResponseSchema } from "./apiResponses/analytics/getTeacherAnalytics";
export { AnalyticsGraphPointType } from "./common/analytics";

// apiRequests - attendance
export { joinLectureRequestSchema } from "./apiRequests/attendance/joinLecture";
export { pingLectureRequestSchema } from "./apiRequests/attendance/pingLecture";
export { submitAttendanceRequestSchema } from "./apiRequests/attendance/submitAttendance";

// apiResponses - attendance
export { joinLectureSuccessResponseSchema } from "./apiResponses/attendance/joinLecture";
export { pingLectureSuccessResponseSchema } from "./apiResponses/attendance/pingLecture";
export { submitAttendanceSuccessResponseSchema } from "./apiResponses/attendance/submitAttendance";
