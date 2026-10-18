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
    >
      <Tabs.Screen name="test/index" />
      <Tabs.Screen name="classes/index" />
      <Tabs.Screen name="settings/index" />
      <Tabs.Screen name="analytics/index" />
      <Tabs.Screen name="attendance/index" />
      <Tabs.Screen name="test/graphql-test" />
      <Tabs.Screen name="role-selection/index" />
    </Tabs>
  );
};

export default MainLayout;
