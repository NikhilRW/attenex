import { ExpoConfig } from "expo/config";

export default (): ExpoConfig => ({
  name: "Attenex",
  slug: "attenex",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "attenex",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.attenex.attenex",
    googleServicesFile: "./personal/google-services.json",
  },
  android: {
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
      },
    },
    googleServicesFile: "./personal/google-services.json",
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
      "ACCESS_BACKGROUND_LOCATION",
      "FOREGROUND_SERVICE",
      "FOREGROUND_SERVICE_LOCATION",
      "INTERNET",
      "POST_NOTIFICATIONS",
      "READ_EXTERNAL_STORAGE",
      "RECEIVE_BOOT_COMPLETED",
      "REQUEST_IGNORE_BATTERY_OPTIMIZATIONS",
      "SYSTEM_ALERT_WINDOW",
      "VIBRATE",
      "WAKE_LOCK",
      "WRITE_EXTERNAL_STORAGE",
    ],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: false,
        data: [
          {
            scheme: "https",
            host: "attenex.vercel.app",
            pathPrefix: "/auth",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
    package: "com.attenex.attenex",
    versionCode: 1,
    icon: "./assets/images/icon.png",
    predictiveBackGestureEnabled: false,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-foreground.png",
      backgroundColor: "#000000",
    },
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location.",
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/ic_launcher.png",
        imageWidth: 170,
        resizeMode: "contain",
        backgroundColor: "#000000",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    "@react-native-google-signin/google-signin",
    "expo-secure-store",
    "expo-font",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    "@react-native-firebase/app",
    "@react-native-firebase/messaging",
    [
      "expo-notifications",
      {
        icon: "./assets/images/notification_icon.png",
        color: "#000000",
        sounds: ["assets/mp3s/notification.mp3"],
      },
    ],
    "./plugins/androidManifestPlugin.js",
    "./plugins/androidMainApplicationPlugin.js",
    "react-native-edge-to-edge",
    "expo-background-task",
    [
      "expo-build-properties",
      {
        android: {
          enableMinifyInReleaseBuilds: true,
          enableProguardInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          enablePngCrunchInReleaseBuilds: true,
          extraProguardRules: [
            // Keep your app classes
            "-keep class com.myapp.** { *; }",

            // React Native essentials
            "-keep class com.facebook.react.** { *; }",
            "-keep class com.facebook.hermes.** { *; }",

            // Preserve debugging info
            "-keepattributes SourceFile,LineNumberTable",
            "-keepattributes *Annotation*",

            // Common third-party libraries
            "-keep class com.swmansion.reanimated.** { *; }",
            "-dontwarn com.facebook.react.**",
          ].join("\n"),
        },
        ios: {
          useFrameworks: "static",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
    tsconfigPaths: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "7d67df1b-1d5a-46d6-9a9f-c753d28d7723",
    },
  },
});
