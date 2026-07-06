import { useThemeStore } from "@shared/hooks/useTheme";
import { mmkvStorage } from "@shared/utils/mmkvStorage";
import { secureStore } from "@shared/utils/secureStore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserSchema } from "../schemas/auth";

interface AuthState {
  user: UserSchema | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNotSynced: boolean;
  setAuth: (user: UserSchema | null, token: string | null, isSignUp?: boolean) => void;
  updateUser: (user: Partial<UserSchema>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setIsNotSynced: (isNotSynced: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isNotSynced: false,
      isAuthenticated: false,
      isLoading: true,
      setAuth: (user, token) => {
        if (__DEV__) {
          console.log(token);
        }
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },
      updateUser: (updatedFields) => {
        set((state) => ({
          user: state.user ? ({ ...state.user, ...updatedFields } as UserSchema) : null,
        }));
      },
      setIsNotSynced: (isNotSynced: boolean) => {
        set(() => ({
          isNotSynced,
        }));
      },
      logout: () => {
        // Remove token from secure storage and clear the persisted state
        secureStore.removeItem("jwt").catch((err) => {
          console.error("Failed to remove token from secure storage", err);
        });
        useThemeStore.getState().setTheme("system");
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
      storage: createJSONStorage(() => mmkvStorage),
      // Persist only non-sensitive fields. We keep token out of MMKV and store it in secure storage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        isNotSynced: state.isNotSynced,
      }),
      onRehydrateStorage: () => (state) => {
        (async () => {
          // After rehydration, load token from secure storage (if any) into runtime store
          const token = await secureStore.getItem("jwt");
          if (token) {
            state?.setAuth?.(state.user, token);
            state?.setIsNotSynced?.(state.isNotSynced);
          } else {
            // No token found; set loading to false
            (state as any)?.setLoading?.(false);
          }
        })();
      },
    },
  ),
);
