import { User } from "@/backend/src/config/database_setup";
import { Entypo, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";
import { useAuthStore } from "../stores/authStore";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const BUTTON_WIDTH = 80;

const CustomTabBar = ({
  state: { index, routeNames },
  navigation,
  ...props
}: BottomTabBarProps) => {
  const { colors } = useTheme();
  const role = useAuthStore().user!.role;

  // Filter routes based on user role
  const filteredRoutes = routeNames.filter((name) => {
    // Hide role-selection if user already has a role
    if (role && name.includes("role-selection")) {
      return false;
    }
    if (role === "student" && name.includes("classes")) {
      return false; // Hide classes tab for students
    }
    if (
      role === "teacher" &&
      (name.includes("attendance") ||
        name.includes("create-") ||
        name.includes("lecture-ended"))
    ) {
      return false; // Hide attendance tab for teachers
    }

    if (!role && !name.includes("role-selection")) {
      return false; // If no role, only show role-selection
    }
    return true;
  });

  // Find the active tab index in the filtered routes
  const activeRouteName = routeNames[index];
  const activeFilteredIndex = filteredRoutes.indexOf(activeRouteName);

  const activatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      width: BUTTON_WIDTH,
      height: 60,
      left:
        activeFilteredIndex >= 0 ? activeFilteredIndex * BUTTON_WIDTH + 10 : 10,
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: 5,
          backgroundColor: colors.surface.cardBg,
          borderColor: colors.surface.glassBorder,
        },
      ]}
    >
      <Animated.View
        key={"activated-background"}
        layout={LinearTransition}
        style={[
          styles.activeBackground,
          { backgroundColor: colors.primary.glow },
          activatedBackgroundStyle,
        ]}
      />

      {filteredRoutes.map((name, idx) => {
        const routeIndex = routeNames.indexOf(name);
        const isActivated = index === routeIndex;
        return (
          <TabBarButton
            key={`index-${idx}`}
            name={name}
            role={role}
            isActivated={isActivated}
            onPress={() => navigation.navigate(name)}
            colors={colors}
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
  onPress: () => void;
  colors: any;
  role: User["role"];
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  name,
  isActivated,
  onPress,
  colors,
  role,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isActivated ? 1 : 0.6);
  const backgroundOpacity = useSharedValue(isActivated ? 1 : 0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(isActivated ? 1 : 0.6, { duration: 300 });
    backgroundOpacity.value = withSpring(isActivated ? 1 : 0);
    iconScale.value = withSpring(isActivated ? 1.1 : 1);
  }, [backgroundOpacity, iconScale, isActivated, opacity]);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, {});
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {});
  };

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
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View layout={LinearTransition} style={animatedIconStyle}>
        {getIconForRoute(name, isActivated, colors)}
      </Animated.View>
      {!isActivated && (
        <Animated.Text
          key={"key-" + name}
          exiting={FadeOut.duration(300).easing(Easing.inOut(Easing.quad))}
          style={[
            styles.tabLabel,
            {
              color: isActivated ? colors.primary.main : colors.text.secondary,
            },
          ]}
        >
          {name.split("/index")[0]}
        </Animated.Text>
      )}
    </AnimatedPressable>
  );
};

export const getIconForRoute = (
  routeName: string,
  activated: boolean,
  colors: any
) => {
  const color = activated ? colors.primary.main : colors.text.secondary;
  if (routeName.includes("attendance")) {
    return <FontAwesome6 name="calendar" size={25} color={color} />;
  } else if (routeName.includes("classes")) {
    return <Entypo name="blackboard" size={25} color={color} />;
  } else if (routeName.includes("role-selection")) {
    return <Ionicons name="people" size={25} color={color} />;
  } else if (routeName.includes("settings")) {
    return <Ionicons name="settings-outline" size={25} color={color} />;
  } else if (routeName.includes("create-class")) {
    return <Ionicons name="school" size={25} color={color} />;
  }
};

const styles = StyleSheet.create({
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
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    borderRadius: 30,
    elevation: 0,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0,
    // shadowRadius: 8,
    zIndex: 2,
    borderWidth: 1,
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
  },
  tabLabel: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
});
