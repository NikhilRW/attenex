import { useLinkedInAuth } from "../hooks/useLinkedInAuth";
import { styles } from "../styles/LinkedInAuth.styles";
import LinkedInView from "react-native-linkedin-oauth2";
import { View } from "react-native";
import { router } from "expo-router";
import { LINKEDIN_CONFIG } from "../constants/linkedin";

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
            containerStyle={{ backgroundColor: "#000" }}
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
            containerStyle={{ backgroundColor: "#000" }}
          />
        ) /* Placeholder for potential future logout handling */
      }
    </View>
  );
};

export default LinkedInAuth;
