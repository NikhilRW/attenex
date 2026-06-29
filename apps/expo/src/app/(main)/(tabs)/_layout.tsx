import { queryClient } from "@/shared/constants/tanstackConfig";
import { setupMainOfflineMutations } from "@/shared/utils/tanstack";
import CustomTabBar from "@shared/components/CustomTabBar";
import { Tabs } from "expo-router";
import React from "react";

setupMainOfflineMutations(queryClient);

const MainLayout = () => {
  return (
    <>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: "transparent" },
          animation: "shift",
          
        }}
      ></Tabs>
    </>
  );
};

export default MainLayout;
