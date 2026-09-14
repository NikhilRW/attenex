import { RefreshAuthTokenSuccessResponse } from "@attenex/api-contracts";

import { secureStore } from "./secureStore";

export const getUserAuthToken = async () => {
  return await secureStore.getItem("jwt");
};
export const getUserRefreshToken = async () => {
  return await secureStore.getItem("refresh-token");
};
export const setUserAuthToken = async (token: string) => {
  await secureStore.setItem("jwt", token);
};
export const setUserRefreshToken = async (token: string) => {
  await secureStore.setItem("refresh-token", token);
};
export const clearUsersTokens = async () => {
  await Promise.all([secureStore.removeItem("jwt"), secureStore.removeItem("refresh-token")]);
};

export const setUserTokens = async ({ token, refreshToken }: RefreshAuthTokenSuccessResponse) => {
  try {
    await Promise.all([setUserAuthToken(token), setUserRefreshToken(refreshToken)]);
  } catch (error) {
    await clearUsersTokens();
    throw error;
  }
};
