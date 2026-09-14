import {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
  create,
  InternalAxiosRequestConfig,
} from "axios";
import { showMessage } from "react-native-flash-message";

import { BASE_URI } from "@shared/constants/uri";
import { useAuthStore } from "@shared/stores/authStore";

import {
  attachAuthHeader,
  expireSession,
  getRefreshPromise,
  isPublicAuthRoute,
  refreshSession,
  setRefreshPromise,
} from "./httpAuth";
import { getErrorMessage } from "./httpErrors";
import { getUserAuthToken } from "./user";

export type HttpRequestConfig = AxiosRequestConfig;
export type HttpResponse<T = any> = AxiosResponse<T>;
export type HttpError<T = any> = AxiosError<T>;

const http = create({
  baseURL: BASE_URI,
  adapter: "fetch",
});

http.interceptors.request.use(async (config) => {
  console.log("[HTTP Request]", config.method?.toUpperCase(), config.url);
  return attachAuthHeader(config);
});

http.interceptors.response.use(
  (response) => {
    console.log("[HTTP Response]", response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !isPublicAuthRoute(originalRequest.url)
    ) {
      const currentToken = await getUserAuthToken();
      if (originalRequest._retry) {
        if (useAuthStore.getState().isAuthenticated) await expireSession();
      } else if (currentToken && useAuthStore.getState().isAuthenticated) {
        originalRequest._retry = true;
        const headers = AxiosHeaders.from(originalRequest.headers);

        if (headers.get("Authorization") === `Bearer ${currentToken}`) {
          const promise = getRefreshPromise() ?? refreshSession(currentToken);
          setRefreshPromise(promise);
          headers.set("Authorization", `Bearer ${await promise}`);
        } else {
          headers.set("Authorization", `Bearer ${currentToken}`);
        }
        originalRequest.headers = headers;
        return http(originalRequest);
      }
    }

    const errorMessage = getErrorMessage(error);
    if (error.response?.status === 403 && errorMessage.toLowerCase().includes("blocked")) {
      showMessage({
        message: "Account Blocked",
        description: "Your account has been blocked. Contact support.",
        type: "danger",
        duration: 4000,
      });
      await expireSession();
      throw error;
    }

    if (__DEV__) {
      showMessage({
        message: "Error occurred",
        description: errorMessage,
        type: "danger",
      });
      console.error("[HTTP Error]", error.response?.status, error.config?.url);
    }

    error.message = errorMessage;
    throw error;
  },
);

export default http;
