import { useLocalSearchParams, useRouter } from "expo-router";

export const useVerifyEmail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string | undefined;

  const handleBackToSignIn = () => {
    router.replace("/(auth)/sign-in");
  };

  return {
    handleBackToSignIn,
    email,
  };
};
