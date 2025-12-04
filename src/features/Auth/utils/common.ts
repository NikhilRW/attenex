import { User } from "@/backend/src/config/database_setup";
import { BASE_URI } from "@/src/shared/constants/uri";
import { authService } from "@/src/shared/services/authService";
import { googleAuth } from "@/src/shared/utils/google-auth";
import { http } from "@/src/shared/utils/http";
import { logger } from "@/src/shared/utils/logger";
import { router } from "expo-router";
import { showMessage } from "react-native-flash-message";
import { RegisterGoogleUserResponse } from "../types/request";
import { SignInFormData, SignUpFormData } from "../validation/authSchemas";
import * as Linking from "expo-linking";
import { useAuthStore } from "@/src/shared/stores/authStore";
import { secureStore } from "@/src/shared/utils/secureStore";
import { email } from "zod";

/**
 * Authentication Utility Functions
 *
 * This module contains handlers for different OAuth authentication methods:
 * - Google Sign-In: Uses Google Identity Services for native mobile authentication
 * - LinkedIn Sign-In: Uses custom WebView-based OAuth flow for LinkedIn authentication
 *
 * Both methods integrate with the backend API and Zustand auth store for session management.
 */

/**
 * Google Sign-In Handler
 *
 * Handles the complete Google OAuth flow using Google Identity Services.
 * This is a native mobile authentication method that provides seamless integration.
 *
 * Flow:
 * 1. Initiates Google sign-in using native Google SDK
 * 2. User authenticates via Google account picker/system dialog
 * 3. Receives ID token and user profile data
 * 4. Sends user data to backend for account creation/verification
 * 5. Updates local auth store with user data and tokens
 * 6. Shows success message and logs the event
 *
 * Error Handling:
 * - Cancelled sign-in: Shows warning message
 * - Network/API errors: Shows error message with details
 * - All errors are logged for debugging
 */
export const handleGoogleSignIn = async () => {
  try {
    // Step 1: Initiate Google sign-in
    const response = await googleAuth.signIn();

    // Handle user cancellation (when they dismiss the Google account picker)
    if (response.type === "cancelled") {
      showMessage({
        message: "Sign-in Cancelled",
        description: "You cancelled the Google sign-in process",
        type: "warning",
        duration: 2000,
        position: "bottom",
      });
      return;
    }

    // Step 2: Send user data to backend for account creation/verification
    // Backend will create user if they don't exist, or return existing user data
    const newUser = await http.post<RegisterGoogleUserResponse>(
      `${BASE_URI}/api/users/signin?authType=google`, // Google user registration endpoint (http uses BASE_URI)
      {
        name: response.data.user.name,
        email: response.data.user.email,
        photo_url: response.data.user.photo,
        oauth_id: response.data.user.id,
        oauth_provider: "google",
      }
    );

    // Step 3: Update local authentication state
    // Stores user data and Google ID token in Zustand store
    // Use authService to persist token securely and set user state
    await authService.login(newUser.data.user!, response.data.idToken!);

    // Step 4: Show success feedback to user and navigate to main flow
    showMessage({
      message: "Sign-in Successful!",
      description: `Welcome, ${newUser.data.user?.name}`,
      type: "success",
      duration: 2500,
      position: "bottom",
    });

    // Step 5: Log successful authentication for monitoring
    logger.info(
      `Google sign-in successful for user: ${newUser.data.user?.email}`,
      "common.ts :: handleGoogleSignIn()"
    );

    // Navigate to the main stack (replace to avoid back navigation to auth)
    router.replace("/(main)/role-selection");
  } catch (err) {
    // Handle any errors during the sign-in process
    const e = err as any;

    // Extract user-friendly error message
    let errorMessage = "Something went wrong. Please try again.";

    if (e.response?.data?.error) {
      errorMessage = e.response.data.error;
    } else if (e.message?.includes("Network Error")) {
      errorMessage =
        "Unable to connect. Please check your internet connection.";
    } else if (
      e.message &&
      !e.message.includes("Object") &&
      !e.message.includes("undefined")
    ) {
      errorMessage = e.message;
    }

    showMessage({
      message: "Sign-in Failed",
      description: errorMessage,
      type: "danger",
      duration: 3000,
      position: "bottom",
    });

    // Log full error for debugging
    logger.error(JSON.stringify(e), "common.ts :: handleGoogleSignIn()");
  }
};

/**
 * LinkedIn Sign-In Handler
 *
 * Initiates the LinkedIn OAuth flow using a custom WebView-based approach.
 * This method provides more control over the OAuth flow compared to native SDKs.
 *
 * Flow:
 * 1. Navigates to custom LinkedIn auth screen (/auth/linkedin)
 * 2. LinkedInAuth screen handles the complete OAuth flow in WebView
 * 3. WebView intercepts authorization code from LinkedIn redirect
 * 4. Code is exchanged for tokens on the backend
 * 5. User data is stored and navigatio`n continues to main app
 *
 * Why WebView instead of native SDK:
 * - Better control over OAuth parameters and security
 * - Consistent behavior across platforms
 * - No need for additional native dependencies
 * - Easier to handle custom redirect URIs
 *
 * Error Handling:
 * - Navigation errors: Shows error message
 * - All errors are logged for debugging
 */
export const handleLinkedInSignIn = () => {
  try {
    // Navigate to LinkedIn authentication screen
    // The LinkedInAuth component will handle the complete OAuth flow
    router.push("/(auth)/linkedin");
  } catch (err) {
    // Handle navigation or initialization errors
    const e = err as any;

    let errorMessage = "Unable to start LinkedIn sign-in. Please try again.";
    if (e.message && !e.message.includes("Object")) {
      errorMessage = e.message;
    }

    showMessage({
      message: "LinkedIn Sign-in Failed",
      description: errorMessage,
      type: "danger",
      duration: 3000,
      position: "bottom",
      floating: true,
    });
    logger.error(JSON.stringify(e), "common.ts :: handleLinkedInSignIn()");
  }
};

export const handleEmailSignIn = async (data: SignInFormData) => {
  try {
    const {
      data: { token, user },
      status,
    } = await http.post<{
      user: User;
      token: string;
    }>("/api/users/signin?authType=email", {
      email: data.email!,
      password: data.password!,
    });

    if (user.isVerified === false) {
      showMessage({
        message: "Email Not Verified",
        description: "Please verify your email before signing in.",
        type: "warning",
        duration: 3000,
        position: "bottom",
      });
      return;
    }

    if (status !== 200) {
      showMessage({
        message: "Sign-in Failed",
        description: "Invalid email or password. Please try again.",
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
      return;
    }

    await authService.login(user, token);

    showMessage({
      message: "Welcome Back!",
      description: `Hi ${user.name}, you're all set!`,
      type: "success",
      duration: 2500,
      position: "bottom",
    });

    // Replace to main stack after successful signin
    router.replace("/(main)/role-selection");
  } catch (err) {
    const e = err as any;

    // Parse user-friendly error message
    let errorMessage = "Unable to sign in. Please check your credentials.";

    if (e.response?.status === 401) {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (e.response?.status === 400) {
      errorMessage =
        e.response?.data?.error || "Please check your email and password.";
    } else if (
      e.message?.includes("Network Error") ||
      e.message?.includes("connect")
    ) {
      errorMessage =
        "Unable to connect. Please check your internet connection.";
    } else if (e.response?.data?.error) {
      errorMessage = e.response.data.error;
    }

    showMessage({
      message: "Sign-in Failed",
      description: errorMessage,
      type: "danger",
      duration: 3000,
      position: "bottom",
    });
    logger.error(
      JSON.stringify(e.response?.data || e.message),
      "common.ts :: handleEmailSignIn()"
    );
  }
};

export const handleEmailSignUp = async (data: SignUpFormData) => {
  try {
    const {
      data: { token, user },
      status,
    } = await http.post<{
      user: User;
      token: string;
    }>(BASE_URI + "/api/users/signup?authType=email", {
      name: data.fullName!,
      email: data.email!,
      password: data.password!,
    });

    if (status !== 201) {
      showMessage({
        message: "Sign-up Failed",
        description: "Unable to create account. Please try again.",
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
      return;
    }

    await authService.signup(user, token);
    useAuthStore.setState({ isAuthenticated: false }); // Require email verification

    showMessage({
      message: "Account Created!",
      description: `Welcome aboard, ${user.name}! Let's get started.`,
      type: "success",
      duration: 2500,
      position: "bottom",
    });

    router.replace("/verify-email");
  } catch (err) {
    const e = err as any;

    // Parse user-friendly error message
    let errorMessage = "Unable to create account. Please try again.";

    if (e.response?.status === 409) {
      errorMessage =
        "This email is already registered. Please sign in instead.";
    } else if (e.response?.status === 400) {
      errorMessage =
        e.response?.data?.error ||
        "Please check your information and try again.";
    } else if (
      e.message?.includes("Network Error") ||
      e.message?.includes("connect")
    ) {
      errorMessage =
        "Unable to connect. Please check your internet connection.";
    } else if (e.response?.data?.error) {
      errorMessage = e.response.data.error;
    }

    showMessage({
      message: "Sign-up Failed",
      description: errorMessage,
      type: "danger",
      duration: 3000,
      position: "bottom",
    });
    logger.error(
      JSON.stringify(e.response?.data || e.message),
      "common.ts :: emailSignUp()"
    );
  }
};
export const handleEmailVerification = async (deepLink: Linking.ParsedURL) => {
  try {
    const token = deepLink.queryParams!.token;
    const response = await http.post<{ success: boolean; message: string }>(
      BASE_URI + "/api/users/verify-user",
      {
        token: decodeURIComponent(token as string),
        email: decodeURIComponent(deepLink.queryParams!.email as string),
      }
    );
    console.log("response.data : " + JSON.stringify(response.data));

    if (response.data.success) {
      router.replace("/(auth)/sign-in?verified=true");
      useAuthStore.setState({ isAuthenticated: false });
    } else {
      showMessage({
        message: "Invalid or Expired Link",
        description: response.data.message,
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
    }
  } catch (err) {
    const e = err as any;
    let errorMessage = "Email verification failed. Please try again.";
    if (e.response?.data?.error) {
      errorMessage = e.response.data.error;
    }
    showMessage({
      message: "Verification Failed",
      description: errorMessage,
      type: "danger",

      duration: 3000,
      position: "bottom",
    });
    logger.error(
      JSON.stringify(e.response?.data || e.message),
      "common.ts :: handleEmailVerification()"
    );
  }
};
