import { useOfflineMutations } from "@/shared/hooks/useOfflineMutations";
import CustomTabBar from "@shared/components/CustomTabBar";
import { Tabs } from "expo-router";
import React from "react";

const MainLayout = () => {
  useOfflineMutations();
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "transparent" },
      }}
    />
  );
};

export default MainLayout;
