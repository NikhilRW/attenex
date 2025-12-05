import { Stack } from "expo-router";
import React from "react";

/**
 * Authentication Layout Configuration
 *
 * This layout defines the navigation structure for all authentication-related screens.
 * It uses Expo Router's Stack navigation to manage the auth flow.
 *
 * Authentication Screens:
 * - sign-in/index: Traditional email/password sign-in
 * - sign-up/index: User registration screen
 * - linkedin/index: LinkedIn OAuth authentication screen
 *
 * Navigation Flow:
 * 1. App starts → Check auth state → Redirect to auth or main screens
 * 2. User chooses sign-in method (Google, LinkedIn, or email)
 * 3. OAuth flows redirect to respective screens
 * 4. Successful auth → Navigate to main app with user data
 *
 * All screens have headers hidden for a clean, full-screen auth experience.
 */
const _layout = () => {
  return (
      <Stack
        initialRouteName="sign-in/index" // Default to sign-in screen
        screenOptions={{ headerShown: false }} // Clean, headerless auth screens
      >
        {/* Traditional Email/Password Sign-In Screen */}
        <Stack.Screen name="sign-in/index" options={{ headerShown: false }} />

        {/* User Registration Screen */}
        <Stack.Screen name="sign-up/index" options={{ headerShown: false }} />

        {/* LinkedIn OAuth Authentication Screen
         *
         * This screen contains a WebView that handles the complete LinkedIn OAuth flow:
         * 1. Loads LinkedIn authorization URL with app credentials
         * 2. User authenticates on LinkedIn's website
         * 3. LinkedIn redirects back with authorization code
         * 4. WebView intercepts the redirect URL
         * 5. Code is sent to backend for token exchange
         * 6. User data is stored and navigation continues to main app
         *
         * Security: Client secret never touches the frontend
         */}
        <Stack.Screen name="linkedin/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="forgot-password/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="reset-password/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="verify-email/index"
          options={{ headerShown: false }}
        />
      </Stack>
  );
};

export default _layout;
