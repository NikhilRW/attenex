import { ActivityIndicator, View } from "react-native";
import WebView from "react-native-webview";
import { useLinkedInAuth } from "../hooks";
import { styles } from "../styles/LinkedInAuth.styles";
import { LINKEDIN_LOGOUT_REDIRECT_URI } from "../constants";

const LinkedInAuth = () => {
  const {
    colors,
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
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Loading overlay shown during WebView loading and auth processing */}
      {isLoading && (
        <View
          style={[
            styles.loadingOverlay,
            { backgroundColor: colors.background.overlay },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary.main} />
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
