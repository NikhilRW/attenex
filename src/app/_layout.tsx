import { Stack } from "expo-router";
import FlashMessage from "react-native-flash-message";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
      <FlashMessage position="top" />
    </>
  );
}
