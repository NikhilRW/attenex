import { defaultFaliureCount } from "@/shared/utils/tanstack";
import { sendVerificationEmailRequest } from "../utils/email";
import { mutationKeys } from "@/shared/constants/mutationKeys";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useOfflineMutations = () => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
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
  });
}