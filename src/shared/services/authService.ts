import { useAuthStore } from "@/src/shared/stores/authStore";
import { secureStore } from "@/src/shared/utils/secureStore";

export const authService = {
  async login(user: any, token: string) {
    // Persist token securely and set state
    try {
      await secureStore.setItem("jwt", token);
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
    useAuthStore.getState().setAuth(user, token);
  },

  async logout() {
    try {
      await secureStore.removeItem("jwt");
    } catch (err) {
      console.error("authService: failed to remove token", err);
    }
    useAuthStore.getState().logout();
  },
};
