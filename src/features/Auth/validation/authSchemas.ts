import { z } from "zod";

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
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email")
    .email("This doesn't look like a valid email"),
  password: z
    .string()
    .min(1, "Please enter your password")
    .min(6, "Password is too short (minimum 6 characters)"),
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
export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Please enter your full name")
      .min(2, "Name should be at least 2 characters")
      .max(100, "Name is too long (maximum 100 characters)"),
    email: z
      .string()
      .min(1, "Please enter your email")
      .email("This doesn't look like a valid email"),
    password: z
      .string()
      .min(1, "Please create a password")
      .min(8, "Password should be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password needs uppercase, lowercase, and a number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Error will be attached to confirmPassword field
  });

/**
 * Reset Password Schema
 *
 * Validates password reset form.
 * Requirements:
 * - Strong new password (minimum 8 characters with uppercase, lowercase, number)
 * - Password confirmation must match
 */
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Please create a password")
      .min(8, "Password should be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password needs uppercase, lowercase, and a number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Error will be attached to confirmPassword field
  });

/**
 * TypeScript Types derived from Zod Schemas
 * These provide type safety throughout the application
 */
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
