import { AxiosError, AxiosHeaders, InternalAxiosRequestConfig, isAxiosError } from "axios";

import { requestTokenRefresh } from "@shared/services/tokenService";
import { useAuthStore } from "@shared/stores/authStore";

import { clearUsersTokens, getUserAuthToken, getUserRefreshToken, setUserTokens } from "./user";

export const publicAuthRoutes = new Set([
  "/api/users/signin",
  "/api/users/signup",
  "/api/users/forgot-password",
  "/api/users/verify-reset-token",
  "/api/users/reset-password",
  "/api/users/verify-user",
  "/api/users/send-verification-email",
  "/api/users/refresh-token",
]);

export const isPublicAuthRoute = (url = "") => {
  const path = url
    .split(/[?#]/)[0]
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/\/+$/, "");
  return publicAuthRoutes.has(path);
};

export const expireSession = async () => {
  await useAuthStore.getState().logout();
};

let refreshPromise: Promise<string> | null = null;

export const refreshSession = async (token: string) => {
  const session = useAuthStore.getState();
  const isCurrentSession = () => {
    const current = useAuthStore.getState();
    return (
      current.isAuthenticated &&
      current.token === session.token &&
      current.user?.id === session.user?.id
    );
  };

  try {
    const refreshToken = await getUserRefreshToken();
    if (!refreshToken) {
      if (isCurrentSession()) await expireSession();
      throw new Error("Your session has expired. Please sign in again.");
    }

    const tokens = await requestTokenRefresh({ token, refreshToken });
    if (!isCurrentSession()) {
      throw new AxiosError("Session changed during refresh", AxiosError.ERR_CANCELED);
    }

    try {
      await setUserTokens(tokens);
    } catch (error) {
      if (isCurrentSession()) await expireSession();
      throw error;
    }

    if (!isCurrentSession()) {
      if (!useAuthStore.getState().isAuthenticated) await clearUsersTokens();
      throw new AxiosError("Session changed during refresh", AxiosError.ERR_CANCELED);
    }
    useAuthStore.setState({ token: tokens.token });
    return tokens.token;
  } catch (error) {
    if (
      isCurrentSession() &&
      isAxiosError(error) &&
      [401, 403, 404].includes(error.response?.status ?? 0)
    ) {
      await expireSession();
    }
    throw error;
  } finally {
    refreshPromise = null;
  }
};

export const getRefreshPromise = () => refreshPromise;
export const setRefreshPromise = (promise: Promise<string> | null) => {
  refreshPromise = promise;
};

export const attachAuthHeader = async (config: InternalAxiosRequestConfig) => {
  const state = useAuthStore.getState();
  const token = state.token ?? (await getUserAuthToken());

  if (token) {
    config.headers = AxiosHeaders.from(config.headers);
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
};
