import { Entypo, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  FadeOut,
  FadingTransition,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const BUTTON_WIDTH = 100;

const CustomTabBar = ({
  state: { index, routeNames },
  navigation,
  ...props
}: BottomTabBarProps) => {
  const { colors } = useTheme();

  const activatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: "50%",
      transform: [{ translateY: -30 }],
      left: index * BUTTON_WIDTH + 8,
    };
  });
  return (
    <Animated.View
      entering={LinearTransition}
      style={[
        styles.container,
        {
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

      {routeNames.map((name, idx) => {
        const isActivated = index === idx;
        return (
          <TabBarButton
            key={`index-${idx}`}
            name={name}
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
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  name,
  isActivated,
  onPress,
  colors,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isActivated ? 1 : 0.6);
  const backgroundOpacity = useSharedValue(isActivated ? 1 : 0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(isActivated ? 1 : 0.6, { duration: 300 });
    backgroundOpacity.value = withSpring(isActivated ? 1 : 0);
    iconScale.value = withSpring(isActivated ? 1.1 : 1);
  }, [isActivated]);

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

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
    transform: [
      {
        scale: interpolate(
          backgroundOpacity.value,
          [0, 1],
          [0.8, 1],
          Extrapolate.CLAMP
        ),
      },
    ],
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
      {isActivated && (
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
  }
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: "80%",
    position: "absolute",
    bottom: -5,
    left: "50%",
    transform: [
      {
        translateX: "-50%",
      },
    ],
    marginHorizontal: "auto",
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    width: 116,
    height: 60,
    borderRadius: 30,
  },
  tabLabel: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
});
