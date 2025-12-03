import { useAuthStore } from "@/src/shared/stores/authStore";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Wait for auth state to be loaded
  if (isLoading) {
    return null;
  }

  // Redirect based on authentication status
  if (!isAuthenticated) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }

  return <Redirect href={"/(main)/role-selection"} />;
}
