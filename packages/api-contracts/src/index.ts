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
