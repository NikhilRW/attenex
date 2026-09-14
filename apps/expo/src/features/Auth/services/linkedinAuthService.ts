import * as v from "valibot";

import {
  linkedInAuthSuccessResponseSchema,
  LinkedInAuthSuccessResponse,
} from "@attenex/api-contracts";
import http from "@shared/utils/http";

export const linkedinAuthService = {
  async exchangeCodeForUser(
    code: string,
    redirectUri: string,
  ): Promise<LinkedInAuthSuccessResponse | null> {
    try {
      const response = await http.post(`/api/users/signin?authType=linkedin`, {
        code,
        redirectUri,
      });

      const parsed = v.safeParse(linkedInAuthSuccessResponseSchema, response.data);
      if (!parsed.success) {
        console.error("linkedinAuthService: invalid response shape", parsed.issues);
        return null;
      }

      return parsed.output;
    } catch (err: any) {
      console.error(
        "linkedinAuthService: exchangeCodeForUser failed",
        err.response?.data || err.message,
      );

      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      } else if (err.message?.includes("Network Error")) {
        throw new Error("Unable to connect. Please check your internet connection.");
      }

      throw err;
    }
  },
};
