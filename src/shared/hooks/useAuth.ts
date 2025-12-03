import { authService } from "@/src/shared/services/authService";
import { useCallback } from "react";

/**
 * useAuth hook
 * Provides composable auth helpers (login, logout) so components don't directly access store details.
 * This keeps authentication behavior centralized and modular.
 */
export const useAuth = () => {
  const login = useCallback(async (user: any, token: string) => {
    await authService.login(user, token);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
  }, []);

  return { login, logout };
};
