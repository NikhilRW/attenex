import { GarbageTime, StaleTime } from "@/shared/constants/tanstackConfig";
import {
  handleVerificationEmailResponse,
  sendVerificationEmailRequest,
} from "@auth/utils/email";
import { queryKeys } from "@shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";

export const useVerifyEmail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const sendEmail = async () => {
    if (params.email) {
      const response = await sendVerificationEmailRequest(
        params.email as string,
      );
      if (response?.data?.success) {
        handleVerificationEmailResponse(response);
      }
      return response;
    }
    return false;
  };

  useQuery({
    queryFn: sendEmail,
    queryKey: queryKeys.auth.verifyEmail(params.email as string | undefined),
    enabled: true,
    staleTime: StaleTime.SECONDS_25,
    gcTime: GarbageTime.SECONDS_25,
  });

  const handleBackToSignIn = () => {
    router.replace("/(auth)/sign-in");
  };

  return {
    handleBackToSignIn,
    email: params.email as string | undefined,
  };
};
