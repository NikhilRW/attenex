import {
  focusManager,
  onlineManager,
  QueryClient,
} from "@tanstack/react-query";
import * as Network from "expo-network";
import { AppState, AppStateStatus, Platform } from "react-native";

export const setupTanstackForReactNative = (queryClient: QueryClient) => {
  // Set up online/offline detection for React Native
  onlineManager.setEventListener((setOnline) => {
    const eventSubscription = Network.addNetworkStateListener(async (state) => {
      const isOnline = !!state.isConnected;
      console.log("App Network Status 🛜 Changed : " + isOnline);
      setOnline(isOnline);
      if (isOnline) {
        await queryClient.resumePausedMutations();
      }
    });
    return eventSubscription.remove;
  });

  // Set up focus management for app state changes
  const subscription = AppState.addEventListener(
    "change",
    (status: AppStateStatus) => {
      if (Platform.OS !== "web") {
        focusManager.setFocused(status === "active");
        console.log(`📱 App state changed: ${status}`);
      }
    },
  );

  return () => subscription.remove();
};
