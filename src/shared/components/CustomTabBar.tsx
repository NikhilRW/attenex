import { lectureService } from "@classes/services/lectureService";
import Entypo from "@react-native-vector-icons/entypo";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { queryKeys } from "@shared/constants/queryKeys";
import { StaleTime } from "@shared/constants/tanstackConfig";
import { useAuthStore } from "@shared/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo } from "react";
import { Pressable } from "react-native";
import Animated, {
  Easing,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const BUTTON_WIDTH = 80;
const TabEntypo = withUnistyles(Entypo);
const TabFontAwesome6 = withUnistyles(FontAwesome6);
const TabIonicons = withUnistyles(Ionicons);
const TabMaterialCommunityIcons = withUnistyles(MaterialCommunityIcons);

const isFreshQuery = (
  dataUpdatedAt: number | undefined,
  staleTimeMs: number,
) => {
  return dataUpdatedAt != null && Date.now() - dataUpdatedAt < staleTimeMs;
};

const CustomTabBar = ({
  state: { index, routeNames },
  navigation,
}: BottomTabBarProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const role = user?.role;

  const handleTabPrefetch = useCallback(
    (routeName: string) => {
      if (routeName.includes("attendance") && role === "student") {
        const className = (user as any)?.className;
        if (!className) {
          return;
        }

        const queryState = queryClient.getQueryState(
          queryKeys.lectures.student,
        );
        const isDataFresh = isFreshQuery(
          queryState?.dataUpdatedAt,
          StaleTime.SECONDS_30,
        );

        if (!isDataFresh) {
          queryClient.prefetchQuery({
            queryKey: queryKeys.lectures.student,
            queryFn: async () => {
              const res = await lectureService.getStudentLectures(className);
              return res.success ? res.data || [] : [];
            },
            staleTime: StaleTime.SECONDS_30,
          });
        }
      }

      if (routeName.includes("classes") && role === "teacher") {
        const queryState = queryClient.getQueryState(queryKeys.classes.teacher);
        const isDataFresh = isFreshQuery(
          queryState?.dataUpdatedAt,
          StaleTime.SECONDS_30,
        );

        if (!isDataFresh) {
          queryClient.prefetchQuery({
            queryKey: queryKeys.classes.teacher,
            queryFn: async () => {
              const res = await lectureService.getTeacherClasses();
              return res.success ? [...res.data] : [];
            },
            staleTime: StaleTime.SECONDS_30,
          });
        }
      }
    },
    [queryClient, role, user],
  );

  const filteredRoutes = useMemo(() => {
    return routeNames
      .filter((name) => {
        if (!role) {
          return false;
        }

        if (!__DEV__ && name.includes("test")) {
          return false;
        }

        if (role && name.includes("role-selection")) {
          return false;
        }
        if (role === "student" && name.includes("classes")) {
          return false;
        }
        if (
          role === "teacher" &&
          (name.includes("attendance") ||
            name.includes("create-") ||
            name.includes("lecture-ended"))
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.includes("settings")) return 1;
        if (b.includes("settings")) return -1;
        return 0;
      });
  }, [role, routeNames]);

  const handleNavigate = useCallback(
    (routeName: string) => {
      navigation.navigate(routeName);
    },
    [navigation],
  );

  // Find the active tab index in the filtered routes
  const activeRouteName = routeNames[index];
  const activeFilteredIndex = useMemo(
    () => filteredRoutes.indexOf(activeRouteName),
    [activeRouteName, filteredRoutes],
  );

  const isEmptyTabBar = filteredRoutes.length === 0;

  const activatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      width: isEmptyTabBar ? 0 : BUTTON_WIDTH,
      height: 60,
      left:
        activeFilteredIndex >= 0 ? activeFilteredIndex * BUTTON_WIDTH + 10 : 10,
    };
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
          />
        );
      })}
    </Animated.View>
  );
};

export default CustomTabBar;

interface TabBarButtonProps {
  name: string;
  isActivated: boolean;
  onPress: (routeName: string) => void;
  onPrefetch?: (routeName: string) => void;
}

const TabBarButton = React.memo(
  ({ name, isActivated, onPress, onPrefetch }: TabBarButtonProps) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(isActivated ? 1 : 0.6);
    // const backgroundOpacity = useSharedValue(isActivated ? 1 : 0);
    const iconScale = useSharedValue(1);

    useDerivedValue(() => {
      opacity.value = withTiming(isActivated ? 1 : 0.6, { duration: 300 });
      // backgroundOpacity.value = withSpring(isActivated ? 1 : 0);
      iconScale.value = withSpring(isActivated ? 1.1 : 1);
    }, [isActivated]);

    const handlePressIn = useCallback(() => {
      scale.value = withSpring(0.9, {});
      onPrefetch?.(name);
    }, [name, onPrefetch, scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, {});
    }, [scale]);

    const handlePress = useCallback(() => {
      onPress(name);
    }, [name, onPress]);

    const animatedContainerStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
      transform: [{ scale: iconScale.value }],
    }));

    return (
      <AnimatedPressable
        style={[styles.navigationButton, animatedContainerStyle]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View layout={LinearTransition} style={animatedIconStyle}>
          {getIconForRoute(name, isActivated)}
        </Animated.View>
        {!isActivated && (
          <Animated.Text
            key={"key-" + name}
            exiting={FadeOut.duration(300).easing(Easing.inOut(Easing.quad))}
            style={styles.tabLabel(isActivated)}
          >
            {name.split("/index")[0]}
          </Animated.Text>
        )}
      </AnimatedPressable>
    );
  },
);
TabBarButton.displayName = "TabBarButton";

const getIconForRoute = (routeName: string, activated: boolean) => {
  if (routeName.includes("attendance")) {
    return (
      <TabFontAwesome6
        name="calendar"
        size={25}
        uniProps={(theme) => ({
          color: activated ? theme.primary.main : theme.text.secondary,
        })}
      />
    );
  } else if (routeName.includes("classes")) {
    return (
      <TabEntypo
        name="blackboard"
        size={25}
        uniProps={(theme) => ({
          color: activated ? theme.primary.main : theme.text.secondary,
        })}
      />
    );
  } else if (routeName.includes("role-selection")) {
    return (
      <TabIonicons
        name="people"
        size={25}
        uniProps={(theme) => ({
          color: activated ? theme.primary.main : theme.text.secondary,
        })}
      />
    );
  } else if (routeName.includes("settings")) {
    return (
      <TabIonicons
        name="settings-outline"
        size={25}
        uniProps={(theme) => ({
          color: activated ? theme.primary.main : theme.text.secondary,
        })}
      />
    );
  } else if (routeName.includes("create-class")) {
    return (
      <TabIonicons
        name="school"
        size={25}
        uniProps={(theme) => ({
          color: activated ? theme.primary.main : theme.text.secondary,
        })}
      />
    );
  } else if (routeName.includes("test")) {
    return (
      <TabMaterialCommunityIcons
        name="test-tube"
        size={25}
        uniProps={(theme) => ({
          color: activated ? theme.primary.main : theme.text.secondary,
        })}
      />
    );
  }
};

const styles = StyleSheet.create((theme) => ({
  container: {
    height: 70,
    position: "absolute",
    left: "50%",
    transform: [
      {
        translateX: "-50%",
      },
    ],
    marginHorizontal: "auto",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    borderRadius: 30,
    elevation: 0,
    zIndex: 2,
    borderWidth: 1,
    backgroundColor: theme.surface.cardBg,
    borderColor: theme.surface.glassBorder,
    bottom: 0,
  },
  hidden: {
    display: "none",
  },
  navigationButton: {
    flexDirection: "column",
    width: BUTTON_WIDTH,
    height: 60,
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 30,
    position: "relative",
  },
  activeBackground: {
    position: "absolute",
    top: 5,
    borderRadius: 30,
    backgroundColor: theme.primary.glow,
  },
  tabLabel: (isActivated: boolean) => ({
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
    color: isActivated ? theme.primary.main : theme.text.secondary,
  }),
}));
