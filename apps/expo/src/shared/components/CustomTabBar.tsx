import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import Animated, { LinearTransition } from "react-native-reanimated";
import { routeNameToNavButtonTestId } from "../utils/ui";
import { styles } from "../styles/customTabBarStyles";
import TabBarButton from "./TabBarButton";
import { useCustomTabBar } from "../hooks/useCustomTabBar";

const CustomTabBar = ({
  state: { index, routeNames },
  navigation,
}: BottomTabBarProps) => {
  
  const {
    activatedBackgroundStyle,
    filteredRoutes,
    handleNavigate,
    handleTabPrefetch,
    isEmptyTabBar,
    isAuthenticated,
    user,
  } = useCustomTabBar({
    index,
    navigation,
    routeNames,
  });

  if (user === null) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        (isEmptyTabBar || !isAuthenticated) && styles.hidden,
      ]}
    >
      <Animated.View
        key={"activated-background"}
        layout={LinearTransition}
        style={[styles.activeBackground, activatedBackgroundStyle]}
      />

      {filteredRoutes.map((name) => {
        const routeIndex = routeNames.indexOf(name);
        const isActivated = index === routeIndex;
        return (
          <TabBarButton
            key={name}
            name={name}
            isActivated={isActivated}
            onPress={handleNavigate}
            onPrefetch={handleTabPrefetch}
            testID={routeNameToNavButtonTestId(name)}
          />
        );
      })}
    </Animated.View>
  );
};

export default CustomTabBar;
