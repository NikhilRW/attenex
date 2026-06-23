import {
  focusManager,
  onlineManager,
  QueryClient,
} from "@tanstack/react-query";
import * as Network from "expo-network";
import { AppState, AppStateStatus, Platform } from "react-native";
import { mutationKeys } from "../constants/mutationKeys";
import {
  createLectureMutateFn,
  createNewClassMutateFn,
  deleteLectureMutateFn,
  nameUpdateMutateFn,
  roleUpdateMutateFn,
  updateLectureMutateFn,
} from "../utils/offlineMutationFuncs";
import { queryKeys } from "../constants/queryKeys";

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

export const defaultFaliureCount = (failureCount: number) => {
  return Math.min(1000 * 2 * failureCount, 30000);
};

export const setupMainOfflineMutations = (queryClient: QueryClient) => {
  /**
   * For making the name update feature offline first.
   */
  queryClient.setMutationDefaults(mutationKeys.user.updateName, {
    mutationFn: nameUpdateMutateFn,
    networkMode: "online",
    gcTime: Infinity,
    retry: 3,
    retryDelay: defaultFaliureCount,
  });

  /**
   * For making the role update feature offline first.
   */
  queryClient.setMutationDefaults(mutationKeys.user.updateRole, {
    mutationFn: roleUpdateMutateFn,
    networkMode: "online",
    gcTime: Infinity,
    retry: 3,
    retryDelay: defaultFaliureCount,
  });

  /**
   * For able to add new class in an offline first way.
   */
  queryClient.setMutationDefaults(mutationKeys.classes.create, {
    mutationFn: createNewClassMutateFn,
    gcTime: Infinity,
    retry: 1,
    retryDelay: defaultFaliureCount,
  });

  /**
   * For being able to add new lecture in an offline first way.
   */
  queryClient.setMutationDefaults(mutationKeys.lectures.create, {
    mutationFn: createLectureMutateFn,
    networkMode: "online",
    gcTime: Infinity,
    retry: 1,
    retryDelay: defaultFaliureCount,
  });

  /**
   * For being able to delete lecture in an offline first way.
   */
  queryClient.setMutationDefaults(mutationKeys.lectures.delete, {
    mutationFn: deleteLectureMutateFn,
    networkMode: "online",
    gcTime: Infinity,
    retry: 1,
    retryDelay: defaultFaliureCount,
  });

  /**
   * For able to edit lecture even when offline
   */
  queryClient.setMutationDefaults(mutationKeys.lectures.update, {
    mutationFn: updateLectureMutateFn,
    networkMode: "online",
    gcTime: Infinity,
    retry: 1,
    retryDelay: defaultFaliureCount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lectures.teacher,
      });
    },
  });
};

export const isFreshQuery = (
  dataUpdatedAt: number | undefined,
  staleTimeMs: number,
) => {
  return dataUpdatedAt != null && Date.now() - dataUpdatedAt < staleTimeMs;
};

