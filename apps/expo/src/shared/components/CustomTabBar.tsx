import type { BottomTabBarProps } from "expo-router/js-tabs";
import Animated, { LinearTransition } from "react-native-reanimated";

import TabBarButton from "./TabBarButton";
import { useCustomTabBar } from "../hooks/useCustomTabBar";
import { styles } from "../styles/customTabBarStyles";
import { routeNameToNavButtonTestId } from "../utils/ui";

const CustomTabBar = ({ state, emitter, navigateToTab }: BottomTabBarProps) => {
  const {
    activatedBackgroundStyle,
    filteredRoutes,
    handleNavigate,
    handleTabPrefetch,
    isEmptyTabBar,
    isAuthenticated,
    user,
  } = useCustomTabBar({
    state,
    emitter,
    navigateToTab,
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
        const isActivated = state.routes[state.index]?.name === name;
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
