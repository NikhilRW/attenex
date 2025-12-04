import { handleEmailVerification } from "@/src/features/Auth/utils/common";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import FlashMessage from "react-native-flash-message";
import * as SplashScreen from "expo-splash-screen";
import { Inter_700Bold, useFonts } from "@expo-google-fonts/inter";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  const [loaded, error] = useFonts({
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    // Handle deep link when app is opened from a closed state
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    // Handle deep link when app is already running (foreground or background)
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    handleInitialURL();

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = async (url: string) => {
    const parsed = Linking.parse(url);
    console.log("Deep Link Received:", parsed);

    // Handle reset-password deep link
    if (parsed.path && parsed.path.includes("reset-password")) {
      const token = parsed.queryParams?.token as string;
      const email = parsed.queryParams?.email as string;

      if (token && email) {
        router.navigate("/");
        router.navigate(`/reset-password?token=${token}&email=${email}`);
      }
      return;
    }

    // Handle verify-email deep link
    if (parsed.path && parsed.path.includes("verify-email")) {
      return await handleEmailVerification(parsed);
    }
  };

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
      <FlashMessage position="top" />
    </>
  );
}
