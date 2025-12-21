import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { sendVerificationEmail } from "../utils/email";

export const useVerifyEmail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    (async () => {
      if (params.email) {
        await sendVerificationEmail(params.email as string);
      }
    })();
  }, [params.email]);

  const handleBackToSignIn = () => {
    router.replace("/(auth)/sign-in");
  };

  return {
    handleBackToSignIn,
    email: params.email as string | undefined,
  };
};
