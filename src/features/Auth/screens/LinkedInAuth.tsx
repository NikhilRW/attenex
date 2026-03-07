import { ActivityIndicator, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";
import WebView from "react-native-webview";
import { LINKEDIN_LOGOUT_REDIRECT_URI } from "../constants";
import { useLinkedInAuth } from "../hooks";
import { styles } from "../styles/LinkedInAuth.styles";

const LinkedInLoadingIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.primary.main,
}));

const LinkedInAuth = () => {
  const {
    handleLinkedInLogout,
    handleNavigationStateChange,
    isDeleteAccount,
    isLoading,
    isLogout,
    linkedInAuthUrl,
    setIsLoading,
    webViewRef,
  } = useLinkedInAuth();

  return (
    <View style={styles.container}>
      {/* Loading overlay shown during WebView loading and auth processing */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LinkedInLoadingIndicator size="large" />
        </View>
      )}

      {
        isLogout || isDeleteAccount ? (
          <WebView
            ref={webViewRef}
            source={{ uri: LINKEDIN_LOGOUT_REDIRECT_URI }}
            onNavigationStateChange={handleLinkedInLogout}
            style={styles.webView}
            javaScriptEnabled // Required for LinkedIn's interactive login page
            domStorageEnabled // Required for LinkedIn's session and local storage
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          />
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: linkedInAuthUrl }}
            onShouldStartLoadWithRequest={handleNavigationStateChange}
            // onLoadStart={() => setIsLoading(true)}
            // onLoadEnd={() => setIsLoading(false)}
            style={styles.webView}
            javaScriptEnabled // Required for LinkedIn's interactive login page
            domStorageEnabled // Required for LinkedIn's session and local storage
          />
        ) /* Placeholder for potential future logout handling */
      }
    </View>
  );
};

export default LinkedInAuth;
