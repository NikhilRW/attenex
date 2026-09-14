import { AxiosError } from "axios";

export const getErrorMessage = (error: AxiosError) => {
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
