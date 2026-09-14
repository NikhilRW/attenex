import { create } from "axios";
import * as v from "valibot";

import {
  refreshAuthTokenSuccessResponseSchema,
  RefreshAuthTokenSuccessResponse,
} from "@attenex/api-contracts";
import { BASE_URI } from "@shared/constants/uri";

const refreshClient = create({ baseURL: BASE_URI, adapter: "fetch", timeout: 15_000 });

export const requestTokenRefresh = async (tokens: RefreshAuthTokenSuccessResponse) => {
  const response = await refreshClient.get<unknown>("/api/users/refresh-token", {
    headers: {
      Authorization: `Bearer ${tokens.token}`,
      "refresh-token": tokens.refreshToken,
    },
  });

  return v.parse(refreshAuthTokenSuccessResponseSchema, response.data);
};
