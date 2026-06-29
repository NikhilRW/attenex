import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useAuthStore } from "@shared/stores/authStore";
import { unsubscribeFromClassName } from "@shared/utils/fcm";
import http from "@shared/utils/http";
import { logger } from "@shared/utils/logger";
import { secureStore } from "@shared/utils/secureStore";
import { showMessage } from "@shared/utils/toasts";
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
    if (user && user.className) {
      unsubscribeFromClassName(user.className);
    }
    useAuthStore.getState().logout();
    if (user && user.oauthProvider === "linkedin") {
      return;
    }
    router.replace("/sign-in");
  },
  async deleteUserAccount() {
    try {
      const response = await http.delete("/api/users/delete-account");
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
        const user = useAuthStore.getState().user;
        if (user && user.className) {
          unsubscribeFromClassName(user.className);
        }
        useAuthStore.getState().logout();
        if (user && user.oauthProvider === "linkedin") {
          return;
        }
        router.replace("/sign-in");
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
        error.response?.data?.message || "Failed to delete user account",
      );
    }
  },
};
