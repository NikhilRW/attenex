import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const _layout = () => {
  return (
    <Tabs initialRouteName="attendance/index">
      <Tabs.Screen name="attendance/index" options={{ headerShown: false }} />
      <Tabs.Screen name="classes" options={{ headerShown: false }} />
      <Tabs.Screen
        name="role-selection/index"
        options={{ headerShown: false }}
      />
    </Tabs>
  );
};

export default _layout;
