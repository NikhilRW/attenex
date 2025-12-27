import { useAuthStore } from "@shared/stores/authStore";
import http from "@shared/utils/http";
import { router } from "expo-router";

export const handleResetPassword = async () => {
  const { user } = useAuthStore.getState();
  await http.post("/api/users/forgot-password", {
    email: user?.email.trim().toLowerCase(),
  });
  router.push(
    `/(auth)/forgot-password?email=${encodeURIComponent(user?.email || "")}`
  );
};
