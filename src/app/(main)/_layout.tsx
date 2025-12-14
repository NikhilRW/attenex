import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import CustomTabBar from "@/src/shared/components/CustomTabBar";

const _layout = () => {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    />
  );
};

export default _layout;
