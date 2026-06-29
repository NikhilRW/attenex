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
  NotificationContentInput,
  NotificationResponse,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
  useLastNotificationResponse,
} from "expo-notifications";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { UnistylesRuntime } from "react-native-unistyles";
import { queryKeys } from "../constants/queryKeys";
import { queryClient } from "../constants/tanstackConfig";
import {
  parseBody,
  parseLectureId,
  parseTitle,
  parseEndedTrue,
} from "../utils/parsers";
import { ATTENEX_NOTIFICATION_IMAGE_URL } from "../constants/uri";
import { ATTENEX_ANDROID_CHANNEL_ID } from "../constants/notifications";
import { useAuthStore } from "../stores/authStore";

export const useNotificationBootstrap = () => {
  const router = useRouter();
  const userRole = useAuthStore((state) => state.user?.role);

  // Track if we've already handled the killed-state notification to prevent infinite loop
  const {
    hasHandledKilledStateNotification,
    setHasHandledKilledStateNotification,
  } = useNotificationStore();
  const getCurrentTheme = useCallback(() => UnistylesRuntime.getTheme(), []);
  const lastNotificationResponse = useLastNotificationResponse();
  const getNotificationAccentColor = useCallback(() => {
    const currentTheme = getCurrentTheme();

    return UnistylesRuntime.themeName === "dark"
      ? currentTheme.primary.light
      : currentTheme.primary.main;
  }, [getCurrentTheme]);

  const buildAttenexNotificationContent = useCallback(
    (
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
    },
    [getNotificationAccentColor],
  );

  const interactionHandle = useCallback(
    (cleanupTasks: (() => void)[]) =>
      requestIdleCallback(() => {
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
            const lectureId = remoteMessage?.data?.lectureId;
            const ended = remoteMessage?.data?.ended;
            console.log(
              "Checking Firebase initial notification...",
              remoteMessage,
            );
            if (parseLectureId(lectureId) && !parseEndedTrue(ended)) {
              console.log(
                "✅ Firebase notification caused app to open from quit state:",
                JSON.stringify(remoteMessage),
              );
              console.log("Navigating to lecture:", lectureId);
              router.replace(`/attendance?lectureId=${lectureId}`);
              return;
            } else if (parseLectureId(lectureId) && parseEndedTrue(ended)) {
              router.replace(`/classes?lectureId=${lectureId}&ended=true`);
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
            const remoteData = remoteMessage.data;
            if (
              !parseEndedTrue(remoteData?.ended) &&
              parseTitle(remoteMessage?.notification?.title) &&
              parseBody(remoteMessage?.notification?.body)
            ) {
              await scheduleNotificationAsync({
                content: {
                  ...buildAttenexNotificationContent(remoteMessage),
                },
                trigger: null,
              });
            } else if (parseLectureId(remoteData?.lectureId)) {
              if (userRole === "teacher") {
                console.log("I am here teacher 1 ");
                router.setParams({
                  lectureId: remoteData?.lectureId as string,
                  ended: remoteData?.ended as string,
                });
              } else {
                console.log("I am here student 1");
                router.replace(
                  `/attendance?ended=${remoteData?.ended}`,
                );
              }
            }
          },
        );

        // Handle user clicking on a notification and open the screen
        const handleNotificationClick = async (
          response: NotificationResponse,
        ) => {
          const lectureId =
            response?.notification?.request?.content?.data?.lectureId;
          if (parseLectureId(lectureId)) {
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
            const lectureId = remoteMessage?.data?.lectureId;
            console.log(
              "Notification caused app to open from background state:",
              lectureId,
            );
            if (parseLectureId(lectureId)) {
              router.navigate(`/attendance?lectureId=${lectureId}`);
            }
          },
        );

        // Listen for user clicking on a notification
        const notificationClickSubscription =
          addNotificationResponseReceivedListener(handleNotificationClick);

        if (!hasHandledKilledStateNotification) {
          setHasHandledKilledStateNotification(true);
          if (lastNotificationResponse) {
            console.log(
              "📱 Found last notification response (app was killed):",
              JSON.stringify(lastNotificationResponse),
            );
            const lectureId =
              lastNotificationResponse?.notification?.request?.content?.data
                ?.lectureId;
            const result = parseLectureId(lectureId);

            if (result) {
              console.log(
                "✅ Navigating to lecture from notification:",
                lectureId,
              );
              requestIdleCallback(() => {
                setTimeout(() => {
                  router.replace(`/attendance?lectureId=${lectureId}`);
                }, 500);
              });
            }
          } else {
            console.log("No last notification response found");
          }
        }
        const handlePushNotification = async (
          remoteMessage: FirebaseMessagingTypes.RemoteMessage,
        ) => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.lectures.student,
          });
          if (!parseEndedTrue(remoteMessage?.data?.ended)) {
            await scheduleNotificationAsync({
              content: buildAttenexNotificationContent(remoteMessage),
              trigger: null,
            });
          } else {
            const lectureId = remoteMessage?.data?.lectureId;
            if (parseLectureId(lectureId)) {
              if (userRole === "teacher") {
                router.setParams({
                  lectureId: lectureId as string,
                  ended: "true",
                });
                console.log("I am here teacher 2 ");
              } else {
                console.log("I am here student 2 ");
                router.replace(`/attendance?ended=true`);
              }
            }
          }
        };

        const unsubscribe = onMessage(getMessaging(), handlePushNotification);

        cleanupTasks.push(() => {
          notificationClickSubscription.remove();
          unsubscribe();
          onNotificationOpenedAppListener();
        });
      }),
    [
      buildAttenexNotificationContent,
      getCurrentTheme,
      hasHandledKilledStateNotification,
      lastNotificationResponse,
      router,
      setHasHandledKilledStateNotification,
      userRole,
    ],
  );

  useEffect(() => {
    const cleanupTasks: (() => void)[] = [];
    // Defer initialization using requestIdleCallback
    const cleanInteractionHandle = interactionHandle(cleanupTasks);
    return () => {
      cancelIdleCallback(cleanInteractionHandle);
      cleanupTasks.forEach((cleanup) => cleanup());
    };
  }, [
    hasHandledKilledStateNotification,
    interactionHandle,
    router,
    setHasHandledKilledStateNotification,
  ]);
};
