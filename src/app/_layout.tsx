import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)/sign-in" />
      <Stack.Screen name="(auth)/sign-up" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}
