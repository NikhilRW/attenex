import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import * as v from "valibot";

import { deleteUserAccountSuccessResponseSchema } from "@attenex/api-contracts";
import { useAuthStore } from "@shared/stores/authStore";
import { unsubscribeFromClassName } from "@shared/utils/fcm";
import http from "@shared/utils/http";
import { logger } from "@shared/utils/logger";
import { secureStore } from "@shared/utils/secureStore";
import { showMessage } from "@shared/utils/toasts";

import { queryClient } from "../constants/tanstackConfig";
import { setUserTokens } from "../utils/user";

export const authService = {
  async login(user: any, token: string, refreshToken: string) {
    // Persist token securely and set state
    try {
      await setUserTokens({ token, refreshToken });
      await secureStore.removeItem("is-signup");
      useAuthStore.getState().setAuth(user, token);
    } catch (err) {
      console.error("authService: failed to persist token", err);
      throw err;
    }
  },

  async logout() {
    queryClient.clear();
    const user = useAuthStore.getState().user;
    if (GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
    }
    if (user && user.className) {
      unsubscribeFromClassName(user.className);
    }
    await useAuthStore.getState().logout();
    if (user && user.oauthProvider === "linkedin") {
      return;
    }
    router.replace("/sign-in");
  },
  async deleteUserAccount() {
    const user = useAuthStore.getState().user;
    try {
      const response = await http.delete("/api/users/delete-account");
      const parsed = v.safeParse(deleteUserAccountSuccessResponseSchema, response.data);
      if (parsed.success) {
        await useAuthStore.getState().logout();
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
        if (user && user.className) {
          unsubscribeFromClassName(user.className);
        }
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
      throw new Error(error.response?.data?.message || "Failed to delete user account");
    }
  },
};
