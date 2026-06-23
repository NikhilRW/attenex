import React, { useCallback } from "react";
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
import { getIconForRoute } from "../utils/ui";
import { styles } from "../styles/customTabBarStyles";
import { TabBarButtonProps } from "../types/props";
import { Pressable } from "react-native-gesture-handler";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TabBarButton = ({
  name,
  isActivated,
  onPress,
  onPrefetch,
  testID,
}: TabBarButtonProps) => {
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
      testID={testID}
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
};

export default TabBarButton;
