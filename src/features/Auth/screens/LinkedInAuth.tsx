import { useTheme } from "@shared/hooks/useTheme";
import { logger } from "@shared/utils/logger";
// axios not required here; use linkedinAuthService
import { linkedinAuthService } from "@auth/services/linkedinAuthService";
import { authService } from "@shared/services/authService";
import { useAuthStore } from "@shared/stores/authStore";
import { subscribeToClassName } from "@shared/utils/fcm";
import { getStartingScreenPath } from "@shared/utils/navigation";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import WebView from "react-native-webview";
import {
  ShouldStartLoadRequest,
  WebViewNavigation,
} from "react-native-webview/lib/WebViewTypes";
/**
 * LinkedIn OAuth Configuration
 * These values must match your LinkedIn Developer App settings
 */
const LINKEDIN_CLIENT_ID = process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID || "";
const REDIRECT_URI = process.env.EXPO_PUBLIC_LINKEDIN_REDIRECT_URI || "";
const LINKEDIN_SCOPE = "openid profile email"; // Required scopes for user authentication

/**
 * LinkedIn OAuth Authentication Screen
 *
 * This component implements the complete LinkedIn OAuth 2.0 authorization code flow:
 * 1. Displays LinkedIn's authorization page in a WebView
 * 2. Intercepts the redirect URL to capture the authorization code
 * 3. Securely exchanges the code for user data via backend API
 * 4. Stores authentication data and navigates to the main app
 *
 * Security Notes:
 * - Client secret is never exposed to the frontend
 * - All token exchange happens server-side
 * - Authorization code is single-use and expires quickly
 */
const LinkedInAuth = () => {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useTheme();
  const isLogout = useLocalSearchParams().logout === "true";
  const isDeleteAccount = useLocalSearchParams().deleteAccount === "true";
  /**
   * Constructs the LinkedIn OAuth authorization URL
   * This URL opens LinkedIn's login page with our app's configuration
   *
   * URL Parameters:
   * - response_type=code: Requests authorization code (not access token)
   * - client_id: Our LinkedIn app's client identifier
   * - redirect_uri: Where LinkedIn redirects after authorization
   * - scope: Permissions we're requesting (profile, email, openid)
   */
  const linkedInAuthUrl =
    `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${LINKEDIN_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(LINKEDIN_SCOPE)}`;

  /**
   * Handles navigation state changes in the WebView
   * This is crucial for intercepting the OAuth redirect and preventing
   * the WebView from navigating to external URLs
   *
   * @param event - WebView navigation event containing the target URL
   * @returns boolean - Whether to allow the navigation
   */

  const handleNavigationStateChange = (event: ShouldStartLoadRequest) => {
    const { url } = event;

    // Check if this is our redirect URL containing the authorization code
    if (url.startsWith(REDIRECT_URI) && url.includes("code=")) {
      handleAuthCallback(url);
      return false; // Block navigation to keep user in app
    }

    // Check for OAuth errors (user denied access, invalid request, etc.)
    if (url.includes("error=")) {
      const error = new URL(url).searchParams.get("error_description");
      showMessage({
        message: "Sign-in Cancelled",
        description: error || "You cancelled the LinkedIn sign-in",
        type: "warning",
        duration: 3000,
        position: "bottom",
      });
      router.back(); // Return to sign-in screen
      return false;
    }

    return true; // Allow normal navigation within LinkedIn's domain
  };

  /**
   * Processes the authorization code from LinkedIn's redirect
   * This function handles the secure exchange of the authorization code
   * for user authentication data via our backend API
   *
   * Security Flow:
   * 1. Extract authorization code from redirect URL
   * 2. Send code to backend (never expose client secret to frontend)
   * 3. Backend exchanges code for access token
   * 4. Backend fetches user profile from LinkedIn
   * 5. Backend creates/updates user in database
   * 6. Backend returns JWT token and user data
   *
   * @param url - The redirect URL containing the authorization code
   */

  useEffect(() => {
    const main = async () => {
      if (isLogout) {
        authService.logout();
      }
      if (isDeleteAccount) {
        authService.deleteUserAccount();
      }
    };
    main();
  }, [isLogout, isDeleteAccount]);

  const LINKEDIN_LOGOUT_REDIRECT_URI = "https://www.linkedin.com/m/logout";
  const handleAuthCallback = async (url: string) => {
    try {
      setIsLoading(true);

      // Extract the authorization code from URL query parameters
      const authCode = new URL(url).searchParams.get("code");

      if (!authCode) {
        throw new Error("Authentication failed. Please try again.");
      }

      logger.info("LinkedIn auth code received", "LinkedInAuth");

      /**
       * Send authorization code to backend for secure processing
       * The backend will:
       * - Exchange code for access token using client secret
       * - Fetch user profile from LinkedIn API
       * - Create or update user in database
       * - Generate JWT token for session management
       */
      const exchange = await linkedinAuthService.exchangeCodeForUser(
        authCode,
        REDIRECT_URI
      );

      if (!exchange)
        throw new Error("Unable to complete sign-in. Please try again.");

      const { user, token } = exchange;

      console.log("linkedin token : " + token);

      // Store user data and JWT token using the auth hook
      await authService.login(user, token);

      if (user.className && user.role === "student") {
        await subscribeToClassName(user.className);
      }

      // Show success feedback to user
      showMessage({
        message: "Sign-in Successful!",
        description: `Welcome, ${user.name}`,
        type: "success",
        duration: 2500,
        position: "bottom",
      });

      logger.info(
        `LinkedIn sign-in successful for user: ${user.email}`,
        "LinkedInAuth"
      );

      // Navigate to role selection screen (next step in user onboarding)
      useAuthStore.subscribe((newState, prevState) => {
        if (newState.user && prevState.user === null) {
          router.replace(getStartingScreenPath());
        }
      });
    } catch (error) {
      const err = error as any;

      // Extract user-friendly error message
      let errorMessage = "Unable to sign in. Please try again.";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (
        err.message?.includes("Network Error") ||
        err.message?.includes("connect")
      ) {
        errorMessage =
          "Unable to connect. Please check your internet connection.";
      } else if (
        err.message &&
        !err.message.includes("Object") &&
        !err.message.includes("undefined")
      ) {
        errorMessage = err.message;
      }

      // Show error feedback to user
      showMessage({
        message: "Sign-in Failed",
        description: errorMessage,
        type: "danger",
        duration: 3000,
        position: "bottom",
      });

      logger.error(
        JSON.stringify(err.response?.data || err.message),
        "LinkedInAuth :: handleAuthCallback()"
      );

      // Return to sign-in screen on any error
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInLogout = async (event: WebViewNavigation) => {
    if (
      event.url.includes("/home") ||
      event.url.includes("/session_redirect") ||
      event.url.includes("login")
    ) {
      if (isLogout || isDeleteAccount) {
        router.replace("/sign-in");
      }
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Loading overlay shown during WebView loading and auth processing */}
      {isLoading && (
        <View
          style={[
            styles.loadingOverlay,
            { backgroundColor: colors.background.overlay },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      )}

      {
        isLogout || isDeleteAccount ? (
          <WebView
            ref={webViewRef}
            source={{ uri: LINKEDIN_LOGOUT_REDIRECT_URI }}
            onNavigationStateChange={handleLinkedInLogout}
            style={styles.webView}
            javaScriptEnabled // Required for LinkedIn's interactive login page
            domStorageEnabled // Required for LinkedIn's session and local storage
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          />
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: linkedInAuthUrl }}
            onShouldStartLoadWithRequest={handleNavigationStateChange}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            style={styles.webView}
            javaScriptEnabled // Required for LinkedIn's interactive login page
            domStorageEnabled // Required for LinkedIn's session and local storage
          />
        ) /* Placeholder for potential future logout handling */
      }
    </View>
  );
};

export default LinkedInAuth;

/**
 * Styles for the LinkedIn Authentication Screen
 * Uses dark theme to match the app's futuristic aesthetic
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1, // Takes full screen space
  },
  loadingOverlay: {
    position: "absolute", // Overlay on top of WebView
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Ensure it appears above WebView
  },
});
