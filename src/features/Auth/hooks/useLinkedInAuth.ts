import { authService } from "@/src/shared/services/authService";
import { LinkedInProfile } from "react-native-linkedin-oauth2";
import { LINKEDIN_CONFIG } from "../constants/linkedin";
import { LinkedInAuthProps } from "../types/linkedin";
import { handleLinkedInSuccess, linkedInError } from "../utils/common";

export const useLinkedInAuth = ({
  authType,
  isLinkedInModalVisible,
  setIsLinkedInModalVisible,
}: LinkedInAuthProps) => {
  const isLogout = authType === "logout";
  const isDeleteAccount = authType === "deleteAccount";

  const modalCloserWrap =
    (fn: (data?: LinkedInProfile | null) => void | Promise<void>) =>
    async (data?: LinkedInProfile | null) => {
      setIsLinkedInModalVisible(false);
      await fn(data);
    };

  const getLinkedInProps = () => {
    if (isLogout) {
      return {
        isVisible: isLinkedInModalVisible,
        logout: true,
        onLogout: modalCloserWrap(authService.logout),
        onClose: () => {
          setIsLinkedInModalVisible(false);
        },
      };
    }

    if (isDeleteAccount) {
      return {
        isVisible: isLinkedInModalVisible,
        logout: true,
        onLogout: modalCloserWrap(async () => {
          await authService.deleteUserAccount();
        }),
        onClose: () => {
          setIsLinkedInModalVisible(false);
        },
      };
    }

    return {
      isVisible: isLinkedInModalVisible,
      clientSecret: LINKEDIN_CONFIG.CLIENT_SECRET,
      clientId: LINKEDIN_CONFIG.CLIENT_ID,
      redirectUri: LINKEDIN_CONFIG.REDIRECT_URI,
      onSuccess: modalCloserWrap(async (data?: LinkedInProfile | null) => {
        await handleLinkedInSuccess(data!);
      }),
      onError: linkedInError,
      onClose: () => {
        setIsLinkedInModalVisible(false);
      },
    };
  };

  return {
    linkedInProps: getLinkedInProps(),
  };
};
