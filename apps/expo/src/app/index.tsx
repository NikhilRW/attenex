import { Redirect } from "expo-router";

import { useAuthStore } from "@shared/stores/authStore";
import { getStartingScreenPath } from "@shared/utils/navigation";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Wait for auth state to be loaded
  if (isLoading) {
    return null;
  }

  // Redirect based on authentication status
  return isAuthenticated ? (
    <Redirect href={getStartingScreenPath()} />
  ) : (
    <Redirect href="/(auth)/sign-in" />
  );
}
