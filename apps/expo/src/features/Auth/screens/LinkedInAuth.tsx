import { View } from "react-native";

import { router } from "expo-router";
import LinkedInView from "react-native-linkedin-oauth2";

import { LINKEDIN_CONFIG } from "../constants/linkedin";
import { useLinkedInAuth } from "../hooks/useLinkedInAuth";
import { styles } from "../styles/LinkedInAuth.styles";

const LinkedInAuth = () => {
  const {
    isDeleteAccount,
    isLogout,
    errorHandler,
    handleSuccess,
    isVisible,
    setIsVisible,
    handleLinkedInLogout,
  } = useLinkedInAuth();

  return (
    <View style={styles.container}>
      {
        isLogout || isDeleteAccount ? (
          <LinkedInView
            logout
            isVisible={isVisible}
            onLogout={async () => {
              setIsVisible(false);
              await handleLinkedInLogout();
            }}
            onError={errorHandler}
            containerStyle={styles.linkedinContainerStyle}
          />
        ) : (
          <LinkedInView
            isVisible={isVisible}
            onSuccess={handleSuccess}
            onClose={() => {
              setIsVisible(false);
              router.back();
            }}
            clientId={LINKEDIN_CONFIG.CLIENT_ID}
            redirectUri={LINKEDIN_CONFIG.REDIRECT_URI}
            secureMode
            onError={errorHandler}
            containerStyle={styles.linkedinContainerStyle}
          />
        ) /* Placeholder for potential future logout handling */
      }
    </View>
  );
};

export default LinkedInAuth;
