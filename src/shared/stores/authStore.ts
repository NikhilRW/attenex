import { User } from "@/backend/src/config/database_setup";
import { secureStore } from "@/src/shared/utils/secureStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      setAuth: (user, token) => {
        // Persist the token in secure storage (encrypted) and keep user in persisted storage
        secureStore.setItem("jwt", token).catch((err) => {
          // Log error but allow the state to be set (app should still function)
          console.error("Failed to store token in secure storage", err);
        });
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },
      logout: () => {
        // Remove token from secure storage and clear the persisted state
        secureStore.removeItem("jwt").catch((err) => {
          console.error("Failed to remove token from secure storage", err);
        });
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Persist only non-sensitive fields. We keep token out of AsyncStorage and store it in secure storage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
      }),
      onRehydrateStorage: () => (state) => {
        (async () => {
          // After rehydration, load token from secure storage (if any) into runtime store
          const token = await secureStore.getItem("jwt");
          if (token) {
            (state as any)?.setAuth?.((state as any).user, token);
          } else {
            // No token found; set loading to false
            (state as any)?.setLoading?.(false);
          }
        })();
      },
    }
  )
);
