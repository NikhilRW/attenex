import { mutationKeys } from "@/shared/constants/mutationKeys";
import {
  handleVerificationEmailResponse,
  sendVerificationEmailRequest,
} from "@auth/utils/email";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export const useVerifyEmail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string | undefined;
  const sentEmailRef = useRef<string | null>(null);

  const { mutate: sendEmail } = useMutation({
    mutationKey: mutationKeys.auth.sendVerificationEmail,
    mutationFn: sendVerificationEmailRequest,
    onSuccess: (response) => {
      if (response?.data?.success) {
        handleVerificationEmailResponse(response);
      }
    },
  });

  useEffect(() => {
    if (!email || sentEmailRef.current === email) {
      return;
    }

    sentEmailRef.current = email;
    sendEmail(email);
  }, [email, sendEmail]);

  const handleBackToSignIn = () => {
    router.replace("/(auth)/sign-in");
  };

  return {
    handleBackToSignIn,
    email,
  };
};
