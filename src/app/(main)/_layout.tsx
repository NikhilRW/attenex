import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import CustomTabBar from "@/src/shared/components/CustomTabBar";
import { useAuthStore } from "@/src/shared/stores/authStore";

const _layout = () => {
  return (
    // <Tabs initialRouteName="attendance/index" tabBar={CustomTabBar}>
    //   {/* <Tabs.Screen name="attendance/index" options={{ headerShown: false }} />
    //   <Tabs.Screen name="classes" options={{ headerShown: false }} />
    //   <Tabs.Screen
    //     name="role-selection/index"
    //     options={{ headerShown: false }}
    //   /> */}
    // </Tabs>
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    />
  );
};

export default _layout;
