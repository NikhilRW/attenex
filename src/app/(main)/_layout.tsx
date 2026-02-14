import { useOfflineMutations } from "@/shared/hooks/useOfflineMutations";
import CustomTabBar from "@shared/components/CustomTabBar";
import { Tabs } from "expo-router";
import React from "react";

const _layout = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useOfflineMutations();
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    />
  );
};

export default _layout;
