import { GarbageTime, StaleTime } from "@/src/shared/constants/tanstackConfig";
import {
  handleVerificationEmailResponse,
  sendVerificationEmailRequest,
} from "@auth/utils/email";
import { queryKeys } from "@shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export const useVerifyEmail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const sendEmail = async () => {
    if (params.email) {
      return await sendVerificationEmailRequest(params.email as string);
    }
    return false;
  };

  const { data } = useQuery({
    queryFn: sendEmail,
    queryKey: queryKeys.verifyEmail,
    enabled: true,
    staleTime: StaleTime.SECONDS_25,
    gcTime: GarbageTime.SECONDS_25,
  });

  useEffect(() => {
    if (data) {
      handleVerificationEmailResponse(data);
    }
  }, [data]);

  const handleBackToSignIn = () => {
    router.replace("/(auth)/sign-in");
  };

  return {
    handleBackToSignIn,
    email: params.email as string | undefined,
  };
};
