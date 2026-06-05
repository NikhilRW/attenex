import { useAuthStore } from "@shared/stores/authStore";
import {
  getDeviceToken,
  subscribeToClassName,
  unsubscribeFromClassName,
} from "@shared/utils/fcm";
import http from "@shared/utils/http";
import { logger } from "@shared/utils/logger";

export const userService = {
  async updateUserRole(role: "teacher" | "student") {
    try {
      const response = await http.post("/api/users/update-role", {
        role,
      });

      // Update the user in the auth store with the new role
      if (response.data.user) {
        useAuthStore.getState().updateUser(response.data.user);
      }
      if (role === "teacher") {
        unsubscribeFromClassName(useAuthStore.getState().user?.className || "");
        const token = await getDeviceToken();
        
        await this.updateUserToken(token);
      }
      if (role === "student") {
        // Ensure className is subscribed if role is changed to student
        const className = useAuthStore.getState().user?.className;
        if (className) {
          await subscribeToClassName(className);
        }
        await this.updateUserToken(null);
      }
      return response.data;
    } catch (error: any) {
      logger.info("authService:updateUserRole - error", error);
      throw new Error(
        error.response?.data?.error || "Failed to update user role",
      );
    }
  },

  async updateStudentClass(className: string) {
    try {
      const response = await http.post("/api/users/update-class", {
        className,
      });
      unsubscribeFromClassName(useAuthStore.getState().user?.className || "");
      await subscribeToClassName(className);
      // Update the user in the auth store with the new class
      if (response.data.data.user) {
        useAuthStore.getState().updateUser(response.data.data.user);
      }

      await subscribeToClassName(className.trim());
      return response.data;
    } catch (error: any) {
      logger.info("authService:updateStudentClass - error", error);
      throw new Error(
        error.response?.data?.message || "Failed to update student class",
      );
    }
  },
  async updateUserToken(token: string | null) {
    try {
      const response = await http.post("/api/users/update-device-token", {
        token,
      });
      return response.data;
    } catch (error: any) {
      logger.info("authService:updateUserToken - error", error);
      throw new Error(
        error.response?.data?.message || "Failed to update student class",
      );
    }
  },
  async updateUserFullName(fullName: string) {
    try {
      const response = await http.patch("/api/users/full-name", { fullName });
      return response.data;
    } catch (error: any) {
      logger.info("authService:updateUserFullName - error", error.message);
      throw new Error(error.message || "Failed to update user full name");
    }
  },
};
