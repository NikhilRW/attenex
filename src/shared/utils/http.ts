import { BASE_URI } from "@shared/constants/uri";
import { useAuthStore } from "@shared/stores/authStore";
import { secureStore } from "@shared/utils/secureStore";
import {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
  create,
  InternalAxiosRequestConfig,
} from "axios";
import { router } from "expo-router";
import {
  fetch as nitroFetch,
} from "react-native-nitro-fetch";

export type HttpRequestConfig = AxiosRequestConfig;
export type HttpResponse<T = any> = AxiosResponse<T>;
export type HttpError<T = any> = AxiosError<T>;

// TODO: Test that it works with stream,formData,blob, etc. requests and responses acutally then Response would probably be compatible with AxiosResponse one.
const axiosFetchEnv = {
  fetch: nitroFetch,
} as unknown as NonNullable<AxiosRequestConfig["env"]>;

const attachAuthHeader = async (config: InternalAxiosRequestConfig) => {
  const state = useAuthStore.getState();
  let token = state.token;

  if (!token) {
    token = await secureStore.getItem("jwt");
  }

  if (token) {
    config.headers = AxiosHeaders.from(config.headers);
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
};

const handleUnauthorized = (error: AxiosError) => {
  if (error.response?.status !== 401) {
    return;
  }

  const data = error.response.data as
    | {
        error?: unknown;
      }
    | undefined;
  const errorMsg = typeof data?.error === "string" ? data.error : "";
  const normalizedErrorMsg = errorMsg.toLowerCase();

  if (
    normalizedErrorMsg.includes("token") ||
    normalizedErrorMsg.includes("authorization")
  ) {
    useAuthStore.getState().logout();
    router.replace("/sign-in");
  }
};

const getErrorMessage = (error: AxiosError) => {
  const data = error.response?.data as
    | {
        error?: unknown;
        message?: unknown;
      }
    | undefined;

  if (typeof data?.error === "string") {
    return data.error;
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  if (error.message === "Network Error") {
    return "Unable to connect. Please check your internet connection.";
  }

  if (error.code === AxiosError.ETIMEDOUT || error.code === "ECONNABORTED") {
    return "Request timeout. Please try again.";
  }

  return error.message;
};

const http = create({
  baseURL: BASE_URI,
  adapter: "fetch",
  env: {
    ...axiosFetchEnv,
  },
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
  (error: AxiosError) => {
    handleUnauthorized(error);
    error.message = getErrorMessage(error);

    console.error("[HTTP Error]", error.response?.status, error.config?.url);
    return Promise.reject(error);
  },
);

export default http;
