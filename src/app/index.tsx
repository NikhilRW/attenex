import { Redirect, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../shared/stores/authStore";
import { Button, Text, View } from "react-native";

export default function Index() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const inAuthGroup = segments[0] === "(auth)";
  if (!isAuthenticated && !inAuthGroup) {
    return <Redirect href={"/(auth)/sign-in"} />;
  } else if (isAuthenticated && inAuthGroup) {
    return <Redirect href={"/(main)/attendance"} />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button
        title="go to auth"
        onPress={() => router.navigate("/(auth)/sign-in")}
      />
    </View>
  );
}
