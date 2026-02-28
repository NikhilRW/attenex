import ApolloGraphQLProvider from "@/shared/provider/ApolloGraphQLProvider";
import { handleEmailVerification } from "@auth/utils/common";
import { GoogleSans_700Bold, useFonts } from "@expo-google-fonts/google-sans";
import {
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { useTheme } from "@shared/hooks/useTheme";
import { useNotificationStore } from "@shared/stores/notificationStore";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import * as Linking from "expo-linking";
import {
  addNotificationResponseReceivedListener,
  AndroidImportance,
  AndroidNotificationPriority,
  AndroidNotificationVisibility,
  getLastNotificationResponseAsync,
  NotificationContentInput,
  NotificationResponse,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useMemo } from "react";
import FlashMessage from "react-native-flash-message";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { AlertsProvider } from "react-native-paper-alerts";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { queryKeys } from "../shared/constants/queryKeys";
import { queryClient } from "../shared/constants/tanstackConfig";
import { clientPersister } from "../shared/utils";
import { setupTanstackForReactNative } from "../shared/utils/tanstack";
import { useNetworkState } from "expo-network";

const ATTENEX_NOTIFICATION_IMAGE_URL =
  "https://attenex.vercel.app/notification-attachment.png";
const ATTENEX_ANDROID_CHANNEL_ID = "attenex";

// Configure Reanimated logger to suppress warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Disable strict mode to suppress "reading from value" warnings
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isConnected } = useNetworkState();
  const { bottom } = useSafeAreaInsets();

  // Track if we've already handled the killed-state notification to prevent infinite loop
  const {
    hasHandledKilledStateNotification,
    setHasHandledKilledStateNotification,
  } = useNotificationStore();

  const [loaded, error] = useFonts({
    GoogleSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  /**
   * Validates deep link URLs against allowed schemes and domains
   */
  const isValidDeepLink = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      // Whitelist of allowed schemes and domains
      const allowedSchemes = ["attenex", "exp+attenex", "https"];
      const allowedDomains = ["attenex.vercel.app"];

      if (!allowedSchemes.includes(parsedUrl.protocol.replace(":", ""))) {
        return false;
      }

      // For https URLs, verify domain is whitelisted
      if (
        parsedUrl.protocol === "https:" &&
        !allowedDomains.includes(parsedUrl.hostname)
      ) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const buildAttenexNotificationContent = (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ): NotificationContentInput => {
      const title = remoteMessage.notification?.title ?? "Attenex";
      const body = remoteMessage.notification?.body ?? "";

      return {
        title,
        body,
        data: remoteMessage.data,
        sound: "default" as const,
        color: isDark ? colors.primary.light : colors.primary.main,
        attachments: [
          {
            url: ATTENEX_NOTIFICATION_IMAGE_URL,
            identifier: ATTENEX_NOTIFICATION_IMAGE_URL,
            type: "image" as const,
          },
        ],
      };
    };

    // Handle deep link when app is opened from a closed state
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    // Handle deep link when app is already running (foreground or background)
    const subscription = Linking.addEventListener("url", ({ url }) => {
      if (isValidDeepLink(url)) {
        handleDeepLink(url);
      } else {
        console.warn("Blocked invalid deep link:", url);
      }
    });

    handleInitialURL();

    // Android: create an Attenex notification channel (controls importance, vibration, accent light)
    // Safe to call repeatedly; Android will keep existing channel settings.
    setNotificationChannelAsync(ATTENEX_ANDROID_CHANNEL_ID, {
      name: "Attenex",
      importance: AndroidImportance.MAX,
      lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
      enableVibrate: true,
      vibrationPattern: [0, 250, 200, 250],
      lightColor: colors.primary.main,
      sound: "default",
    }).catch(() => {
      // Ignore channel creation failures to avoid blocking app startup.
    });

    // Check if the app was opened from a notification (when the app was completely quit)
    // This checks both Firebase data messages and Expo scheduled notifications
    const checkInitialNotification = async () => {
      try {
        // Check Firebase initial notification (for data-only messages)
        const remoteMessage = await getInitialNotification(getMessaging());
        console.log("Checking Firebase initial notification...", remoteMessage);
        if (remoteMessage?.data?.lectureId && !remoteMessage.data.ended) {
          console.log(
            "✅ Firebase notification caused app to open from quit state:",
            JSON.stringify(remoteMessage),
          );
          console.log("Navigating to lecture:", remoteMessage.data.lectureId);
          router.replace(
            `/attendance?lectureId=${remoteMessage.data.lectureId}`,
          );
          return;
        } else if (remoteMessage?.data?.lectureId && remoteMessage.data.ended) {
          router.replace(
            `/classes?lectureId=${remoteMessage.data.lectureId}&ended=true`,
          );
          return;
        }
      } catch (error) {
        console.error("Error getting Firebase initial notification:", error);
      }
    };

    // Delay to ensure services are initialized
    setTimeout(checkInitialNotification, 1000);

    // Set up the notification handler for the app
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
        priority: AndroidNotificationPriority.MAX,
      }),
    });

    // Handle push notifications when the app is in the background
    setBackgroundMessageHandler(
      getMessaging(),
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log("Message handled in the background!", remoteMessage);
        // Schedule the notification with a null trigger to show immediately
        if (!remoteMessage.data?.ended) {
          await scheduleNotificationAsync({
            content: {
              ...buildAttenexNotificationContent(remoteMessage),
            },
            trigger: null,
          });
        }
      },
    );

    // Handle user clicking on a notification and open the screen
    // This works for both background and killed state when using Expo Notifications
    const handleNotificationClick = async (response: NotificationResponse) => {
      const lectureId =
        response?.notification?.request?.content?.data?.lectureId;
      if (lectureId) {
        console.log("✅ Navigating to lecture from notification:", lectureId);
        // Use replace for cold start, navigate for warm start
        if (
          response?.actionIdentifier ===
          "expo.modules.notifications.actions.DEFAULT"
        ) {
          router.replace(`/attendance?lectureId=${lectureId}`);
        } else {
          router.navigate(`/attendance?lectureId=${lectureId}`);
        }
      }
    };

    // Handle user opening the app from a notification (when the app is in the background)
    const onNotificationOpenedAppListener = onNotificationOpenedApp(
      getMessaging(),
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log(
          "Notification caused app to open from background state:",
          remoteMessage?.data?.lectureId,
        );
        if (remoteMessage?.data?.lectureId) {
          // router.navigate(
          //   `/attendance?lectureId=${remoteMessage.data.lectureId}`
          // );
        }
      },
    );

    // Listen for user clicking on a notification (both foreground and background)
    const notificationClickSubscription =
      addNotificationResponseReceivedListener(handleNotificationClick);

    // CRITICAL: Check if there's a notification response from when app was killed
    // This handles the case where user taps notification when app is completely closed
    // Only check ONCE on initial mount to prevent infinite loop
    if (!hasHandledKilledStateNotification) {
      setHasHandledKilledStateNotification(true);
      getLastNotificationResponseAsync().then((response) => {
        if (response) {
          console.log(
            "📱 Found last notification response (app was killed):",
            JSON.stringify(response),
          );
          const lectureId =
            response?.notification?.request?.content?.data?.lectureId;

          if (lectureId) {
            console.log(
              "✅ Navigating to lecture from notification:",
              lectureId,
            );
            // Use replace for cold start to set up the navigation stack correctly
            router.replace(`/attendance?lectureId=${lectureId}`);
          }
        } else {
          console.log("No last notification response found");
        }
      });
    }
    const handlePushNotification = async (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ) => {
      // Schedule the notification with a null trigger to show immediately
      queryClient.invalidateQueries({
        queryKey: queryKeys.lectures.student,
      });
      if (!remoteMessage.data?.ended) {
        await scheduleNotificationAsync({
          content: buildAttenexNotificationContent(remoteMessage),
          trigger: null,
        });
      } else {
        router.replace(
          `/classes?lectureId=${remoteMessage.data.lectureId}&ended=true`,
        );
      }
    };

    const unsubscribe = onMessage(getMessaging(), handlePushNotification);

    const tanstackCleanUp = setupTanstackForReactNative(queryClient);

    return () => {
      subscription.remove();
      notificationClickSubscription.remove();
      unsubscribe();
      onNotificationOpenedAppListener();
      tanstackCleanUp();
    };
    // eslint-disable-next-line
  }, []);

  const handleDeepLink = async (url: string) => {
    const parsed = Linking.parse(url);
    // console.log("Deep Link Received:", parsed);

    // Handle reset-password deep link
    if (parsed.path && parsed.path.includes("reset-password")) {
      const token = parsed.queryParams?.token as string;
      const email = parsed.queryParams?.email as string;

      if (token && email) {
        router.navigate("/");
        router.navigate(`/reset-password?token=${token}&email=${email}`);
      }
      return;
    }

    // Handle verify-email deep link
    if (parsed.path && parsed.path.includes("verify-email")) {
      return await handleEmailVerification(parsed);
    }
  };

  const tanstackOnSuccess = useCallback(() => {
    if (isConnected) {
      queryClient
        .resumePausedMutations()
        .then(() => queryClient.invalidateQueries());
    }
  }, [isConnected]);

  const ActualTheme = useMemo(
    () => (isDark ? MD3DarkTheme : MD3LightTheme),
    [isDark],
  );

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: isDark ? "black" : "white" }}
      >
        <ApolloGraphQLProvider>
          <>
            <PaperProvider
              theme={{
                ...ActualTheme,
                colors: {
                  ...ActualTheme.colors,
                  primary: colors.primary.main, // Button Text
                  backdrop: "#00000053",
                },
              }}
            >
              <AlertsProvider>
                <PersistQueryClientProvider
                  client={queryClient}
                  onSuccess={tanstackOnSuccess}
                  persistOptions={{
                    persister: clientPersister,
                    maxAge: Infinity, // Keep mutations indefinitely for offline-first
                    dehydrateOptions: {
                      shouldDehydrateMutation: (mutation: any) => {
                        // Persist pending/paused mutations (offline mutations)
                        return mutation.state.status === "pending";
                      },
                    },
                  }}
                >
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(main)" />
                  </Stack>
                </PersistQueryClientProvider>
              </AlertsProvider>
            </PaperProvider>
            <FlashMessage position="bottom" style={{ marginBottom: bottom }} />
          </>
        </ApolloGraphQLProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
