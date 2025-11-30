import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack initialRouteName="sign-in/index">
      <Stack.Screen name="sign-in/index" options={{headerShown:false}} />
      <Stack.Screen name="sign-up/index" options={{headerShown:false}} />
    </Stack>
  );
};

export default _layout;