import { useAuthStore } from "@shared/stores/authStore";
import http from "@shared/utils/http";
import * as v from "valibot";
import { forgotPasswordSuccessResponseSchema } from "@attenex/api-contracts";
import { router } from "expo-router";

export const resetPassword = async () => {
  const { user } = useAuthStore.getState();
  const response = await http.post("/api/users/forgot-password", {
    email: user?.email.trim().toLowerCase(),
  });

  const parsed = v.safeParse(
    forgotPasswordSuccessResponseSchema,
    response.data,
  );

  if (!parsed.success) {
    throw new Error("Failed to send password reset email");
  }

  router.push(
    `/(auth)/forgot-password?email=${encodeURIComponent(user?.email || "")}`
  );
};