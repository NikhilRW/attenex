import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const _layout = () => {
  return (
    <Tabs initialRouteName="attendance">
      <Tabs.Screen
        name="attendance"
        options={{ headerShown: false, title: "Profile" }}
      />
      <Tabs.Screen
        name="classes"
        options={{ headerShown: false, title: "Profile" }}
      />
    </Tabs>
  );
};

export default _layout;
