import { handleEmailVerification } from "@auth/utils/common";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export const useDeepLinkBootstrap = () => {
  const router = useRouter();

  useEffect(() => {
    /**
     * Validates deep link URLs against allowed schemes and domains
     */
    const isValidDeepLink = (url: string): boolean => {
      try {
        const parsedUrl = new URL(url);
        // Whitelist of allowed schemes and domains
        const allowedSchemes = ["attenex", "exp+attenex", "https"];
        const allowedDomains = ["attenex.vercel.app"];

        if (!allowedSchemes.includes(parsedUrl.protocol.replace(":", ""))) {
          return false;
        }

        // For https URLs, verify domain is whitelisted
        if (
          parsedUrl.protocol === "https:" &&
          !allowedDomains.includes(parsedUrl.hostname)
        ) {
          return false;
        }

        return true;
      } catch {
        return false;
      }
    };

    const handleDeepLink = async (url: string) => {
      const parsed = Linking.parse(url);

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

    // Handle deep link when app is opened from a closed state
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    // Handle deep link when app is already running (foreground or background)
    const subscription = Linking.addEventListener("url", ({ url }) => {
      if (isValidDeepLink(url)) {
        handleDeepLink(url);
      } else {
        console.warn("Blocked invalid deep link:", url);
      }
    });

    handleInitialURL();

    return () => {
      subscription.remove();
    };
  }, [router]);
};
