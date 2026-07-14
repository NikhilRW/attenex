import { QueryClient } from "@tanstack/react-query";

import { mutationKeys } from "@/shared/constants/mutationKeys";
import { defaultFaliureCount } from "@/shared/utils/tanstack";

import { sendVerificationEmailRequest } from "../utils/email";

export const setupAuthOfflineMutations = (queryClient: QueryClient) => {
  /**
   * For being to able to send email for account verification
   */
  queryClient.setMutationDefaults(mutationKeys.auth.sendVerificationEmail, {
    mutationFn: sendVerificationEmailRequest,
    networkMode: "online",
    gcTime: Infinity,
    retry: 2,
    retryDelay: defaultFaliureCount,
  });
};
