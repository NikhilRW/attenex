import { FuturisticBackground } from "@/shared/components/FuturisticBackground";
import { useAuthStore } from "@/shared/stores/authStore";
import { Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { useAppQueryBootstrap } from "@shared/hooks/useAppQueryBootstrap";
import { useDeepLinkBootstrap } from "@shared/hooks/useDeepLinkBootstrap";
import { useNotificationBootstrap } from "@shared/hooks/useNotificationBootstrap";
import { useThemeStore } from "@shared/hooks/useTheme";
import { clientPersister } from "@shared/utils/mmkvStorage";
import { markPerformance } from "@shared/utils/performance";
import {
  // PerformanceMeasureView,
  // PerformanceProfiler,
  useResetFlow,
} from "@shopify/react-native-performance";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import Constants from "expo-constants";
import { useNetworkState } from "expo-network";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { useColorScheme } from "react-native";
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
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { useShallow } from "zustand/shallow";
import { queryClient, StaleTime } from "../shared/constants/tanstackConfig";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const ROOT_LAYOUT_SCREEN_NAME = "RootLayout";
const QUERY_PERSIST_MAX_AGE_MS = StaleTime.DAYS_5;
const QUERY_PERSIST_BUSTER = `attenex-${Constants.expoConfig?.version ?? "1"}`;
// Configure Reanimated logger to suppress warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Disable strict mode to suppress "reading from value" warnings
});

SplashScreen.preventAutoHideAsync();

const ThemedSafeAreaView = withUnistyles(SafeAreaView);

const ThemedPaperProvider = withUnistyles(PaperProvider, (theme, rt) => {
  const paperTheme = rt.themeName === "dark" ? MD3DarkTheme : MD3LightTheme;

  return {
    theme: {
      ...paperTheme,
      colors: {
        ...paperTheme.colors,
        primary: theme.primary.main,
        backdrop: "#00000053",
      },
    },
  };
});

const styles = StyleSheet.create((_, rt) => ({
  safeArea: {
    flex: 1,
    backgroundColor: rt.themeName === "dark" ? "black" : "white",
  },
  stackContent: {
    backgroundColor: "transparent",
  },
}));

export default function RootLayout() {
  const { isConnected } = useNetworkState();
  const { bottom } = useSafeAreaInsets();
  const { resetFlow } = useResetFlow();
  const systemColorScheme = useColorScheme();
  const { mode } = useThemeStore(
    useShallow((state) => ({
      mode: state.mode,
    })),
  );

  const effectiveThemeName =
    mode === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : mode;
  const statusBarStyle = effectiveThemeName === "dark" ? "light" : "dark";

  useDeepLinkBootstrap();
  useNotificationBootstrap();
  useAppQueryBootstrap();

  const [loaded, error] = useFonts({
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      markPerformance("fonts-loaded");
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const tanstackOnSuccess = useCallback(() => {
    if (isConnected) {
      resetFlow({ destination: ROOT_LAYOUT_SCREEN_NAME });
      queryClient.resumePausedMutations();
    }
  }, [isConnected, resetFlow]);

  // const reportPreparedCallback = useCallback((report: any) => {
  //   if (__DEV__) {
  //     alert("Render Time : " + report.timeToBootJsMillis);
  //   }
  // }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    // <PerformanceProfiler onReportPrepared={reportPreparedCallback}>
    //   <PerformanceMeasureView
    //     componentInstanceId={componentInstanceId}
    //     interactive
    //     screenName={ROOT_LAYOUT_SCREEN_NAME}
    //   >
    <SafeAreaProvider>
      <StatusBar
        style={statusBarStyle}
        hideTransitionAnimation="fade"
        translucent
      />

      <ThemedSafeAreaView style={styles.safeArea}>
        <FuturisticBackground
          show={!(isAuthenticated && user?.role === "student")}
        />
        <>
          <ThemedPaperProvider>
            <AlertsProvider>
              <PersistQueryClientProvider
                client={queryClient}
                onSuccess={tanstackOnSuccess}
                persistOptions={{
                  persister: clientPersister,
                  maxAge: QUERY_PERSIST_MAX_AGE_MS,
                  buster: QUERY_PERSIST_BUSTER,
                  dehydrateOptions: {
                    // Persist mutations that are queued/in-flight (paused = queued while offline)
                    shouldDehydrateMutation: (mutation: any) => {
                      return (
                        mutation.state.status === "pending" ||
                        mutation.state.status === "paused"
                      );
                    },
                    // Persist successful, fresh query data so screens load instantly after app kill
                    shouldDehydrateQuery: (query: any) => {
                      const isFresh =
                        Date.now() - query.state.dataUpdatedAt <
                        StaleTime.HALF_DAY;
                      return query.state.status === "success" && isFresh;
                    },
                  },
                }}
              >
                <GestureHandlerRootView>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: styles.stackContent,
                    }}
                  >
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(main)" />
                  </Stack>
                </GestureHandlerRootView>
              </PersistQueryClientProvider>
            </AlertsProvider>
          </ThemedPaperProvider>
          <FlashMessage position="bottom" style={{ marginBottom: bottom }} />
        </>
      </ThemedSafeAreaView>
    </SafeAreaProvider>
    //   </PerformanceMeasureView>
    // </PerformanceProfiler>
  );
}
