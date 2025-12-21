import { BASE_URI } from "@/src/shared/constants/uri";
import { useAuthStore } from "@/src/shared/stores/authStore";
import http from "@/src/shared/utils/http";
import { secureStore } from "@/src/shared/utils/secureStore";
import { logger } from "../utils/logger";
import { showMessage } from "react-native-flash-message";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  getDeviceToken,
  subscribeToClassName,
  unsubscribeFromClassName,
} from "../utils/fcm";
import { router } from "expo-router";

export const authService = {
  async login(user: any, token: string) {
    // Persist token securely and set state
    try {
      useAuthStore.getState().setAuth(user, token);
      await secureStore.setItem("jwt", token);
      await secureStore.removeItem("is-signup");
    } catch (err) {
      console.error("authService: failed to persist token", err);
    }
  },

  async logout() {
    const user = useAuthStore.getState().user;
    try {
      await secureStore.removeItem("jwt");
    } catch (err) {
      console.error("authService: failed to remove token", err);
    }
    if (GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
    }
    unsubscribeFromClassName(user?.className || "");
    useAuthStore.getState().logout();
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
        await this.updateUserToken("");
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
        error.response?.data?.message || "Failed to update student class"
      );
    }
  },
  async deleteUserAccount() {
    try {
      const response = await http.delete(
        BASE_URI + "/api/users/delete-account",
        {
          headers: {
            Authorization: "Bearer " + useAuthStore.getState().token,
          },
        }
      );
      if (response.data.success) {
        await secureStore.removeItem("jwt");
        await secureStore.removeItem("is-signup");
        if (GoogleSignin.hasPreviousSignIn()) {
          await GoogleSignin.signOut();
        }
        showMessage({
          message: "Account deleted successfully",
          type: "success",
          duration: 1500,
          position: "bottom",
        });
        unsubscribeFromClassName(useAuthStore.getState().user?.className || "");
        useAuthStore.getState().logout();
      } else {
        showMessage({
          message: response.data.message || "Failed to delete account",
          type: "danger",
          duration: 3000,
          position: "bottom",
        });
      }
      return response.data;
    } catch (error: any) {
      logger.info("authService:deleteUserACcount - error", error);
      showMessage({
        message: error.response?.data?.message || "Failed to delete account",
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
      throw new Error(
        error.response?.data?.message || "Failed to delete user account"
      );
    }
  },
  async updateUserToken(token: string) {
    try {
      const response = await http.post(
        BASE_URI + "/api/users/update-device-token",
        {
          token,
        },
        {
          headers: {
            Authorization: "Bearer " + useAuthStore.getState().token,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      logger.info("authService:updateUserToken - error", error);
      throw new Error(
        error.response?.data?.message || "Failed to update student class"
      );
    }
  },
};
