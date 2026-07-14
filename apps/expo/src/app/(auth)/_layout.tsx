import { Stack } from "expo-router";

import { setupAuthOfflineMutations } from "@/features/Auth/utils/tanstack";
import { queryClient } from "@/shared/constants/tanstackConfig";

setupAuthOfflineMutations(queryClient);

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
const Layout = () => {
  return (
    <Stack
      initialRouteName="sign-in/index" // Default to sign-in screen
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }} // Clean, headerless auth screens
    >
      {/* Traditional Email/Password Sign-In Screen */}
      <Stack.Screen name="sign-in/index" options={{ headerShown: false }} />

      {/* User Registration Screen */}
      <Stack.Screen name="sign-up/index" options={{ headerShown: false }} />
      <Stack.Screen name="linkedin/index" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password/index" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password/index" options={{ headerShown: false }} />
      <Stack.Screen name="verify-email/index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
