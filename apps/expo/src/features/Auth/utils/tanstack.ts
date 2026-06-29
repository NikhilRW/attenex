import { defaultFaliureCount } from "@/shared/utils/tanstack";
import { sendVerificationEmailRequest } from "../utils/email";
import { mutationKeys } from "@/shared/constants/mutationKeys";
import { QueryClient } from "@tanstack/react-query";

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
