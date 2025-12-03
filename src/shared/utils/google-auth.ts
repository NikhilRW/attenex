import { GoogleSignin } from "@react-native-google-signin/google-signin";

class GoogleAuth {
  constructor() {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!,
      
    });
  }
  async signIn() {
    return await GoogleSignin.signIn();
  }
}
export const googleAuth = new GoogleAuth();
