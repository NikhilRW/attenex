import type { BottomTabBarProps } from "expo-router/js-tabs";
import Animated, { LinearTransition } from "react-native-reanimated";

import TabBarButton from "./TabBarButton";
import { useCustomTabBar } from "../hooks/useCustomTabBar";
import { styles } from "../styles/customTabBarStyles";
import { routeNameToNavButtonTestId } from "../utils/ui";

const CustomTabBar = ({ state: { index, routeNames }, navigation }: BottomTabBarProps) => {
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
    <Animated.View style={[styles.container, (isEmptyTabBar || !isAuthenticated) && styles.hidden]}>
      <Animated.View
        key="activated-background"
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
