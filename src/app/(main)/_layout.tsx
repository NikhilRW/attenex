import { Stack } from "expo-router";

const Layout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "transparent", paddingTop: 0 },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lecture-ongoing" options={{ headerShown: false }} />
        <Stack.Screen name="create-lecture" options={{ headerShown: false }} />
        <Stack.Screen name="lecture-ended" options={{ headerShown: false }} />
        <Stack.Screen name="view-attendance" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default Layout;
