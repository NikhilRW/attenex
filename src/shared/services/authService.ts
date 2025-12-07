import { BASE_URI } from "@/src/shared/constants/uri";
import { useAuthStore } from "@/src/shared/stores/authStore";
import http  from "@/src/shared/utils/http";
import { secureStore } from "@/src/shared/utils/secureStore";
import { logger } from "../utils/logger";
import { router } from "expo-router";

export const authService = {
  async login(user: any, token: string) {
    // Persist token securely and set state
    try {
      await secureStore.setItem("jwt", token);
      await secureStore.removeItem("is-signup");
    } catch (err) {
      console.error("authService: failed to persist token", err);
    }
    useAuthStore.getState().setAuth(user, token);
  },

  async signup(user: any, token: string) {
    // Persist token securely and set state
    try {
      await secureStore.setItem("jwt", token);
      await secureStore.setItem("is-signup", "true");
    } catch (err) {
      console.error("authService: failed to persist token", err);
    }
    useAuthStore.getState().setAuth(user, token, true);
  },

  async logout() {
    try {
      await secureStore.removeItem("jwt");
    } catch (err) {
      console.error("authService: failed to remove token", err);
    }
    useAuthStore.getState().logout();
    router.replace("/sign-in");
  },

  async updateUserRole(role: "teacher" | "student") {
    try {
      const response = await http.post(
        BASE_URI + "/api/users/update-role",
        {
          role,
        },
        {
          headers: {
            Authorization: "Bearer " + useAuthStore.getState().token,
          },
        }
      );

      // Update the user in the auth store with the new role
      if (response.data.user) {
        useAuthStore.getState().updateUser(response.data.user);
      }
      return response.data;
    } catch (error: any) {
      logger.info("authService:updateUserRole - error", error);
      throw new Error(
        error.response?.data?.error || "Failed to update user role"
      );
    }
  },

  async updateStudentClass(className: string) {
    try {
      const response = await http.post(
        BASE_URI + "/api/users/update-class",
        {
          className,
        },
        {
          headers: {
            Authorization: "Bearer " + useAuthStore.getState().token,
          },
        }
      );

      // Update the user in the auth store with the new class
      if (response.data.data.user) {
        useAuthStore.getState().updateUser(response.data.data.user);
      }
      return response.data;
    } catch (error: any) {
      logger.info("authService:updateStudentClass - error", error);
      throw new Error(
        error.response?.data?.message || "Failed to update student class"
      );
    }
  },
};
