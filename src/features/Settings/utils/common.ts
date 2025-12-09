import { BASE_URI } from "@/src/shared/constants/uri";
import { useAuthStore } from "@/src/shared/stores/authStore";
import http from "@/src/shared/utils/http";
import { router } from "expo-router";

export const handleResetPassword = async () => {
  const { user } = useAuthStore.getState();
  await http.post(BASE_URI + "/api/users/forgot-password", {
    email: user?.email.trim().toLowerCase(),
  });
  router.push(
    `/(auth)/forgot-password?email=${encodeURIComponent(user?.email || "")}`
  );
};
