import * as v from "valibot";

/**
 * Authentication Form Validation Schemas
 *
 * Centralized validation schemas for all authentication forms using Zod.
 * These schemas provide runtime type checking and validation with clear error messages.
 */

/**
 * Sign In Schema
 *
 * Validates email and password for user login.
 * Requirements:
 * - Valid email format
 * - Password minimum 6 characters
 */
export const signInSchema = v.object({
  email: v.pipe(
    v.string(),
    v.minLength(1, "Please enter your email"),
    v.email("This doesn't look like a valid email"),
  ),
  password: v.pipe(
    v.string(),
    v.minLength(1, "Please enter your password"),
    v.minLength(6, "Password is too short (minimum 6 characters)"),
  ),
});

/**
 * Sign Up Schema
 *
 * Validates all fields for user registration.
 * Requirements:
 * - Full name (minimum 2 characters)
 * - Valid email format
 * - Strong password (minimum 8 characters with uppercase, lowercase, number)
 * - Password confirmation must match
 */
export const signUpSchema = v.pipe(
  v.object({
    fullName: v.pipe(
      v.string(),
      v.minLength(1, "Please enter your full name"),
      v.minLength(2, "Name should be at least 2 characters"),
      v.maxLength(100, "Name is too long (maximum 100 characters)"),
    ),
    email: v.pipe(
      v.string(),
      v.minLength(1, "Please enter your email"),
      v.email("This doesn't look like a valid email"),
    ),
    password: v.pipe(
      v.string(),
      v.minLength(1, "Please create a password"),
      v.minLength(8, "Password should be at least 8 characters"),
      v.regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password needs uppercase, lowercase, and a number",
      ),
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.minLength(1, "Please confirm your password"),
    ),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      ({ password, confirmPassword }) => password === confirmPassword,
      "Password don't match",
    ),
    ["confirmPassword"],
  ),
);

/**
 * Reset Password Schema
 *
 * Validates password reset form.
 * Requirements:
 * - Strong new password (minimum 8 characters with uppercase, lowercase, number)
 * - Password confirmation must match
 */
export const resetPasswordSchema = v.pipe(
  v.object({
    newPassword: v.pipe(
      v.string(),
      v.minLength(1, "Please create a password"),
      v.minLength(8, "Password should be at least 8 characters"),
      v.regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password needs uppercase, lowercase, and a number",
      ),
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.minLength(1, "Please confirm your password"),
    ),
  }),
  v.forward(
    v.partialCheck(
      [["newPassword"], ["confirmPassword"]],
      ({ confirmPassword, newPassword }) => newPassword === confirmPassword,
      "Password don't match",
    ),
    ["confirmPassword"],
  ),
);

/**
 * TypeScript Types derived from Zod Schemas
 * These provide type safety throughout the application
 */
export type SignInFormData = v.InferInput<typeof signInSchema>;
export type SignUpFormData = v.InferInput<typeof signUpSchema>;
export type ResetPasswordFormData = v.InferInput<typeof resetPasswordSchema>;
