import {
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { useNotificationStore } from "@shared/stores/notificationStore";
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
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { UnistylesRuntime } from "react-native-unistyles";
import { queryKeys } from "../constants/queryKeys";
import { queryClient } from "../constants/tanstackConfig";

const ATTENEX_NOTIFICATION_IMAGE_URL =
  "https://attenex.vercel.app/notification-attachment.png";
const ATTENEX_ANDROID_CHANNEL_ID = "attenex";

export const useNotificationBootstrap = () => {
  const router = useRouter();

  // Track if we've already handled the killed-state notification to prevent infinite loop
  const {
    hasHandledKilledStateNotification,
    setHasHandledKilledStateNotification,
  } = useNotificationStore();

  useEffect(() => {
    const cleanupTasks: (() => void)[] = [];
    // Defer initialization using requestIdleCallback
    const interactionHandle = requestIdleCallback(() => {
        const getCurrentTheme = () => UnistylesRuntime.getTheme();

        const getNotificationAccentColor = () => {
          const currentTheme = getCurrentTheme();

          return UnistylesRuntime.themeName === "dark"
            ? currentTheme.primary.light
            : currentTheme.primary.main;
        };

        const buildAttenexNotificationContent = (
          remoteMessage: FirebaseMessagingTypes.RemoteMessage,
        ): NotificationContentInput => {
          const title = remoteMessage.notification?.title ?? "Attenex";
          const body = remoteMessage.notification?.body ?? "";

          return {
            title,
            body,
            data: remoteMessage.data,
            sound: "notification.mp3",
            color: getNotificationAccentColor(),
            attachments: [
              {
                url: ATTENEX_NOTIFICATION_IMAGE_URL,
                identifier: ATTENEX_NOTIFICATION_IMAGE_URL,
                type: "image" as const,
              },
            ],
          };
        };

        // Android: create an Attenex notification channel (controls importance, vibration, accent light)
        // Safe to call repeatedly; Android will keep existing channel settings.
        setNotificationChannelAsync(ATTENEX_ANDROID_CHANNEL_ID, {
          name: "Attenex",
          importance: AndroidImportance.MAX,
          lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
          enableVibrate: true,
          vibrationPattern: [0, 250, 200, 250],
          lightColor: getCurrentTheme().primary.main,
          sound: "notification.mp3",
        }).catch(() => {
          // Ignore channel creation failures to avoid blocking app startup.
        });

        // Check if the app was opened from a notification (when the app was completely quit)
        // This checks both Firebase data messages and Expo scheduled notifications
        const checkInitialNotification = async () => {
          try {
            // Check Firebase initial notification (for data-only messages)
            const remoteMessage = await getInitialNotification(getMessaging());
            console.log(
              "Checking Firebase initial notification...",
              remoteMessage,
            );
            if (remoteMessage?.data?.lectureId && !remoteMessage.data.ended) {
              console.log(
                "✅ Firebase notification caused app to open from quit state:",
                JSON.stringify(remoteMessage),
              );
              console.log(
                "Navigating to lecture:",
                remoteMessage.data.lectureId,
              );
              router.replace(
                `/attendance?lectureId=${remoteMessage.data.lectureId}`,
              );
              return;
            } else if (
              remoteMessage?.data?.lectureId &&
              remoteMessage.data.ended
            ) {
              router.replace(
                `/classes?lectureId=${remoteMessage.data.lectureId}&ended=true`,
              );
              return;
            }
          } catch (error) {
            console.error(
              "Error getting Firebase initial notification:",
              error,
            );
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
        const handleNotificationClick = async (
          response: NotificationResponse,
        ) => {
          const lectureId =
            response?.notification?.request?.content?.data?.lectureId;
          if (lectureId) {
            console.log(
              "✅ Navigating to lecture from notification:",
              lectureId,
            );
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
              router.navigate(
                `/attendance?lectureId=${remoteMessage.data.lectureId}`,
              );
            }
          },
        );

        // Listen for user clicking on a notification
        const notificationClickSubscription =
          addNotificationResponseReceivedListener(handleNotificationClick);

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

        cleanupTasks.push(() => {
          notificationClickSubscription.remove();
          unsubscribe();
          onNotificationOpenedAppListener();
        });
      });

    return () => {
      cancelIdleCallback(interactionHandle);
      cleanupTasks.forEach((cleanup) => cleanup());
    };
  }, [
    hasHandledKilledStateNotification,
    router,
    setHasHandledKilledStateNotification,
  ]);
};
