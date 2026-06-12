import {
  BackdropFilter,
  Blur,
  BlurMask,
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Rect,
  vec,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useAuthStore } from "../stores/authStore";

const styles = StyleSheet.create((_, rt) => ({
  container: (isStudent: boolean, isAuthenticated: boolean) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: isAuthenticated && isStudent ? 0 : rt.insets.top,
    bottom: 0,
  }),
}));

export const FuturisticBackground = ({ show = true }: { show?: boolean }) => {
  const {
    theme: colors,
    rt: {
      themeName,
      screen: { width, height },
    },
  } = useUnistyles();

  const isDark = themeName === "dark";
  const userRole = useAuthStore((state) => state.user?.role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isStudent = userRole === "student";

  const time1 = useSharedValue(0);
  const time2 = useSharedValue(0);
  const time3 = useSharedValue(0);

  useEffect(() => {
    // Initialize animation cycles after first render to avoid writing shared
    // values during the React render phase.
    time1.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 10000, easing: Easing.linear }),
      -1,
      false,
    );
    time2.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 10000, easing: Easing.linear }),
      -1,
      false,
    );
    time3.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 10000, easing: Easing.linear }),
      -1,
      false,
    );

    return () => {
      // Optional cleanup: stop animations by writing a stable value on unmount
      // so that we don't leave long-running animations.
      time1.value = 0;
      time2.value = 0;
      time3.value = 0;
    };
  }, [time1, time2, time3]);

  const centerX = width / 2;
  const centerY = height / 2;

  // Orb 1: Circular motion using sin/cos
  const c1 = useDerivedValue(() => {
    const radius = 100;
    const x = centerX + Math.cos(time1.value) * radius;
    const y = centerY - 150 + Math.sin(time1.value) * radius;
    return vec(x, y);
  });

  // Orb 2: Figure-8 motion using parametric equations
  const c2 = useDerivedValue(() => {
    const scale = 80;
    const x = centerX - 100 + Math.sin(time2.value) * scale;
    const y = centerY + 100 + Math.sin(time2.value * 2) * scale;
    return vec(x, y);
  });

  // Orb 3: Lissajous curve motion
  const c3 = useDerivedValue(() => {
    const scaleX = 120;
    const scaleY = 80;
    const x = centerX + 100 + Math.sin(time3.value * 1.5) * scaleX;
    const y = centerY + Math.cos(time3.value * 2.3) * scaleY;
    return vec(x, y);
  });

  const isVisible = isDark && show;

  const opacityAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withDelay(300, withTiming(isVisible ? 1 : 0, { duration: 0 })),
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container(isStudent,isAuthenticated), opacityAnimatedStyle]}
    >
      <Canvas style={StyleSheet.absoluteFill}>
        {/* Deep Space Background */}
        <Rect
          color={colors.background.primary}
          x={0}
          y={0}
          width={width}
          height={height}
          opacity={isVisible ? 1 : 0}
        />

        {/* Animated Glowing Orbs */}
        <Group opacity={isVisible ? 0.6 : 0}>
          <Circle c={c1} r={180} color={colors.primary.main}>
            <BlurMask blur={60} style="normal" />
          </Circle>
          <Circle c={c2} r={180} color={colors.accent.purple}>
            <BlurMask blur={60} style="normal" />
          </Circle>
          <Circle c={c3} r={160} color={colors.accent.blue}>
            <BlurMask blur={60} style="normal" />
          </Circle>
        </Group>

        {/* Cyber Grid Effect (Subtle) */}
        {/* We can simulate a grid or scanlines if needed, but let's keep it clean for now */}

        {/* Glassmorphism Overlay */}
        <BackdropFilter filter={<Blur blur={30} />} opacity={isVisible ? 1 : 0}>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            color={colors.background.overlay}
          />
        </BackdropFilter>

        {/* Subtle Gradient Overlay to unify */}
        <Rect
          opacity={isVisible ? 1 : 0}
          x={0}
          y={0}
          width={width}
          height={height + 600}
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, height)}
            colors={["transparent", colors.background.gradientEnd]}
          />
        </Rect>
      </Canvas>
    </Animated.View>
  );
};
