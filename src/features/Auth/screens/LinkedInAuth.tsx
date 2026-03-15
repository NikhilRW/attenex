import { useLinkedInAuth } from "../hooks";
import { styles } from "../styles/LinkedInAuth.styles";
import LinkedInView from "react-native-linkedin-oauth2";
import { View } from "react-native";
import { router } from "expo-router";

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
            clientId={process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID as string}
            redirectUri={
              process.env.EXPO_PUBLIC_LINKEDIN_REDIRECT_URI as string
            }
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
