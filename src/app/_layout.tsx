import ApolloGraphQLProvider from "@/shared/provider/ApolloGraphQLProvider";
import { Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { useAppQueryBootstrap } from "@shared/hooks/useAppQueryBootstrap";
import { useDeepLinkBootstrap } from "@shared/hooks/useDeepLinkBootstrap";
import { useNotificationBootstrap } from "@shared/hooks/useNotificationBootstrap";
import { useThemeStore } from "@shared/hooks/useTheme";
import {
  PerformanceMeasureView,
  PerformanceProfiler,
  RenderPassReport,
  useResetFlow,
} from "@shopify/react-native-performance";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useNetworkState } from "expo-network";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { Appearance, useColorScheme } from "react-native";
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
import {
  StyleSheet,
  UnistylesRuntime,
  withUnistyles,
} from "react-native-unistyles";
import { useShallow } from "zustand/shallow";
import { queryClient } from "../shared/constants/tanstackConfig";
import { clientPersister } from "@shared/utils/mmkvStorage";

const ROOT_LAYOUT_SCREEN_NAME = "RootLayout";
Appearance.setColorScheme(null);
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
    backgroundColor: rt.themeName === "dark" ? "black" : "rgb(232 232 232)",
  },
}));

export default function RootLayout() {
  const { isConnected } = useNetworkState();
  const { bottom } = useSafeAreaInsets();
  const { resetFlow, componentInstanceId } = useResetFlow();
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
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const tanstackOnSuccess = useCallback(() => {
    if (isConnected) {
      resetFlow({ destination: ROOT_LAYOUT_SCREEN_NAME });
      queryClient.resumePausedMutations();
    }
  }, [isConnected, resetFlow]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener((state) => {
      if (mode === "system") {
        UnistylesRuntime.setTheme(state.colorScheme as "dark" | "light");
      }
    });
    return () => {
      subscription.remove();
    };
  }, [mode]);

  const reportPreparedCallback = (e: RenderPassReport) => {
    console.log(e);
    alert("Render Time : " + e.timeToBootJsMillis);
  };

  if (!loaded && !error) {
    return null;
  }

  return (
    <PerformanceProfiler onReportPrepared={reportPreparedCallback}>
      <PerformanceMeasureView
        componentInstanceId={componentInstanceId}
        interactive
        screenName={ROOT_LAYOUT_SCREEN_NAME}
      >
        <SafeAreaProvider>
          <StatusBar
            style={statusBarStyle}
            hideTransitionAnimation="fade"
            translucent
          />

          <ThemedSafeAreaView style={styles.safeArea}>
            <ApolloGraphQLProvider>
              <>
                <ThemedPaperProvider>
                  <AlertsProvider>
                    <PersistQueryClientProvider
                      client={queryClient}
                      onSuccess={tanstackOnSuccess}
                      persistOptions={{
                        persister: clientPersister,
                        maxAge: Infinity, // Keep mutations indefinitely for offline-first
                        dehydrateOptions: {
                          // Persist mutations that are queued/in-flight (paused = queued while offline)
                          shouldDehydrateMutation: (mutation: any) => {
                            return (
                              mutation.state.status === "pending" ||
                              mutation.state.status === "paused"
                            );
                          },
                          // Persist successful query data so screens load instantly after app kill
                          shouldDehydrateQuery: (query: any) =>
                            query.state.status === "success",
                        },
                      }}
                    >
                      <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="(main)" />
                      </Stack>
                    </PersistQueryClientProvider>
                  </AlertsProvider>
                </ThemedPaperProvider>
                <FlashMessage
                  position="bottom"
                  style={{ marginBottom: bottom }}
                />
              </>
            </ApolloGraphQLProvider>
          </ThemedSafeAreaView>
        </SafeAreaProvider>
      </PerformanceMeasureView>
    </PerformanceProfiler>
  );
}
