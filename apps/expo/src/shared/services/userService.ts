import { useAuthStore } from "@shared/stores/authStore";
import {
  getDeviceToken,
  subscribeToClassName,
  unsubscribeFromClassName,
} from "@shared/utils/fcm";
import http from "@shared/utils/http";
import { logger } from "@shared/utils/logger";
import * as v from "valibot";
import {
  updateUserRoleSuccessResponseSchema,
  updateStudentClassSuccessResponseSchema,
  updateUserDeviceTokenSuccessResponseSchema,
  updateUserFullNameSuccessResponseSchema,
} from "@attenex/api-contracts";

export const userService = {
  async updateUserRole(role: "teacher" | "student") {
    try {
      const response = await http.post("/api/users/update-role", {
        role,
      });

      const parsed = v.safeParse(
        updateUserRoleSuccessResponseSchema,
        response.data,
      );
      if (!parsed.success) {
        throw new Error("Failed to update user role");
      }
      if (role === "teacher") {
        unsubscribeFromClassName(useAuthStore.getState().user?.className || "");
        const token = await getDeviceToken();
        await this.updateUserToken(token);
      }
      if (role === "student") {
        const className = useAuthStore.getState().user?.className;
        // TODO:fix this
        if (className) {
          await subscribeToClassName(className);
        }
        await this.updateUserToken(null);
      }

      return parsed.output;
    } catch (error: any) {
      logger.info("authService:updateUserRole - error", error);
      throw new Error(
        error.response?.data?.message || "Failed to update user role",
      );
    }
  },

  async updateStudentClass(className: string) {
    try {
      const response = await http.post("/api/users/update-class", {
        className,
      });

      const parsed = v.safeParse(
        updateStudentClassSuccessResponseSchema,
        response.data,
      );
      if (!parsed.success) {
        throw new Error("Failed to update student class");
      }

      unsubscribeFromClassName(useAuthStore.getState().user?.className || "");
      useAuthStore.getState().updateUser({ className: className.trim() });
      await subscribeToClassName(className.trim());

      return parsed.output;
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

      const parsed = v.safeParse(
        updateUserDeviceTokenSuccessResponseSchema,
        response.data,
      );
      if (!parsed.success) {
        throw new Error("Failed to update device token");
      }

      return parsed.output;
    } catch (error: any) {
      logger.info("authService:updateUserToken - error", error);
      throw new Error(
        error.response?.data?.message || "Failed to update device token",
      );
    }
  },
  async updateUserFullName(fullName: string) {
    try {
      const response = await http.patch("/api/users/full-name", { fullName });

      const parsed = v.safeParse(
        updateUserFullNameSuccessResponseSchema,
        response.data,
      );
      if (!parsed.success) {
        throw new Error("Failed to update user full name");
      }

      return parsed.output;
    } catch (error: any) {
      logger.info("authService:updateUserFullName - error", error.message);
      throw new Error(error.message || "Failed to update user full name");
    }
  },
};
