import React from "react";

import { Tabs } from "expo-router";

import { queryClient } from "@/shared/constants/tanstackConfig";
import { setupMainOfflineMutations } from "@/shared/utils/tanstack";
import CustomTabBar from "@shared/components/CustomTabBar";

setupMainOfflineMutations(queryClient);

const MainLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "transparent" },
        animation: "shift",
      }}
    />
  );
};

export default MainLayout;
