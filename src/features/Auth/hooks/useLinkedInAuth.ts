import { authService } from "@/src/shared/services/authService";
import { useAuthStore } from "@/src/shared/stores/authStore";
import { useLocalSearchParams } from "expo-router";
import { LINKEDIN_CONFIG } from "../constants/linkedin";
import { handleLinkedInSuccess, linkedInError } from "../utils/common";

export const useLinkedInAuth = () => {
  const params = useLocalSearchParams();
  const { logout } = useAuthStore();

  const isLogout = params.logout === "true";
  const isDeleteAccount = params.deleteAccount === "true";

  const getLinkedInProps = () => {
    if (isLogout) {
      return {
        isVisible: true,
        logout: true,
        onLogout: logout,
      };
    }

    if (isDeleteAccount) {
      return {
        isVisible: true,
        logout: true,
        onLogout: authService.deleteUserAccount,
      };
    }

    return {
      isVisible: true,
      clientSecret: LINKEDIN_CONFIG.CLIENT_SECRET,
      clientId: LINKEDIN_CONFIG.CLIENT_ID,
      redirectUri: LINKEDIN_CONFIG.REDIRECT_URI,
      onSuccess: handleLinkedInSuccess,
      onError: linkedInError,
    };
  };

  return {
    linkedInProps: getLinkedInProps(),
  };
};
