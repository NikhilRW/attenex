import { BASE_URI } from "@shared/constants/uri";
import { useAuthStore } from "@shared/stores/authStore";
import { secureStore } from "@shared/utils/secureStore";
import { router } from "expo-router";
import { fetch as nitroFetch } from "react-native-nitro-fetch";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type QueryParamValue = string | number | boolean | null | undefined;

export type HttpRequestConfig = Omit<
  RequestInit,
  "body" | "headers" | "method"
> & {
  headers?: HeadersInit;
  params?: Record<string, QueryParamValue>;
};

export type HttpResponse<T = any> = {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: HttpRequestConfig & {
    method: HttpMethod;
    url: string;
  };
};

export type HttpError<T = any> = Error & {
  code?: string;
  config?: HttpResponse<T>["config"];
  isAxiosError: boolean;
  response?: HttpResponse<T>;
};

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

const buildUrl = (url: string, params?: HttpRequestConfig["params"]) => {
  const baseUrl = isAbsoluteUrl(url) ? url : `${BASE_URI ?? ""}${url}`;
  const parsedUrl = new URL(baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        parsedUrl.searchParams.set(key, String(value));
      }
    });
  }

  return parsedUrl.toString();
};

const isFormData = (body: unknown): body is FormData =>
  typeof FormData !== "undefined" && body instanceof FormData;

const isBlob = (body: unknown): body is Blob =>
  typeof Blob !== "undefined" && body instanceof Blob;

const isArrayBuffer = (body: unknown): body is ArrayBuffer =>
  typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer;

const isPlainObjectBody = (body: unknown) =>
  typeof body === "object" &&
  body !== null &&
  !isFormData(body) &&
  !isBlob(body) &&
  !isArrayBuffer(body);

const attachAuthHeader = async (headers: Headers) => {
  const state = useAuthStore.getState();
  let token = state.token;

  if (!token) {
    token = await secureStore.getItem("jwt");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
};

const buildBody = (body: unknown, headers: Headers): RequestInit["body"] => {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (isPlainObjectBody(body)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return JSON.stringify(body);
  }

  return body as RequestInit["body"];
};

const parseResponseBody = async <T>(response: Response): Promise<T> => {
  if (response.status === 204 || response.status === 205) {
    return null as T;
  }

  const text = await response.text();

  if (!text) {
    return null as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as T;
    }
  }

  return text as T;
};

const createHttpError = <T>(
  message: string,
  response: HttpResponse<T> | undefined,
): HttpError<T> => {
  const error = new Error(message) as HttpError<T>;
  error.isAxiosError = true;
  error.response = response;
  error.config = response?.config;
  return error;
};

const handleUnauthorized = (error: HttpError) => {
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

const getErrorMessage = (error: HttpError) => {
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

  if (error.code === "ECONNABORTED") {
    return "Request timeout. Please try again.";
  }

  return error.message;
};

const request = async <T>(
  method: HttpMethod,
  url: string,
  body?: unknown,
  config: HttpRequestConfig = {},
): Promise<HttpResponse<T>> => {
  const { params, headers: configHeaders, ...fetchConfig } = config;
  const requestUrl = buildUrl(url, params);
  const headers = new Headers(configHeaders);
  await attachAuthHeader(headers);

  const requestConfig: HttpResponse<T>["config"] = {
    ...config,
    method,
    url,
  };
  const requestBody = buildBody(body, headers);

  console.log("[HTTP Request]", method, url);

  try {
    const response = await nitroFetch(requestUrl, {
      ...fetchConfig,
      method,
      headers,
      body: requestBody,
    });
    const responseData = await parseResponseBody<T>(response);
    const httpResponse: HttpResponse<T> = {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: requestConfig,
    };

    console.log("[HTTP Response]", response.status, url);

    if (!response.ok) {
      throw createHttpError(
        responseData &&
          typeof responseData === "object" &&
          "error" in responseData &&
          typeof responseData.error === "string"
          ? responseData.error
          : `Request failed with status ${response.status}`,
        httpResponse,
      );
    }

    return httpResponse;
  } catch (err) {
    const error =
      err instanceof Error
        ? (err as HttpError)
        : createHttpError("Network Error", undefined);

    if (!error.isAxiosError) {
      error.isAxiosError = true;
      error.config = requestConfig;
      if (error.name === "AbortError") {
        error.code = "ECONNABORTED";
      } else if (!error.response) {
        error.message = "Network Error";
      }
    }

    handleUnauthorized(error);
    error.message = getErrorMessage(error);

    console.error("[HTTP Error]", error.response?.status, url);
    throw error;
  }
};

const http = {
  get: <T = any>(url: string, config?: HttpRequestConfig) =>
    request<T>("GET", url, undefined, config),
  post: <T = any>(url: string, body?: unknown, config?: HttpRequestConfig) =>
    request<T>("POST", url, body, config),
  put: <T = any>(url: string, body?: unknown, config?: HttpRequestConfig) =>
    request<T>("PUT", url, body, config),
  patch: <T = any>(url: string, body?: unknown, config?: HttpRequestConfig) =>
    request<T>("PATCH", url, body, config),
  delete: <T = any>(url: string, config?: HttpRequestConfig) =>
    request<T>("DELETE", url, undefined, config),
};

export default http;
