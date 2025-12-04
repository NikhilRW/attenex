import { useTheme } from "@/src/shared/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface FuturisticButtonProps {
  title: string;
  onPress: () => void;
  gradient?: string[];
  disabled?: boolean;
  loading?: boolean;
}

export const FuturisticButton: React.FC<FuturisticButtonProps> = ({
  title,
  onPress,
  gradient,
  disabled = false,
  loading = false,
}) => {
  const { colors } = useTheme();
  const buttonScale = useSharedValue(1);

  const defaultGradient = [colors.primary.main, colors.accent.blue];
  const activeGradient = gradient || defaultGradient;

  const handlePressIn = () => {
    if (loading) return;
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
    onPress();
  };

  const handlePressOut = () => {
    if (loading) return;
    buttonScale.value = withSpring(1);
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: disabled || loading ? 0.6 : 1,
  }));

  return (
    <Animated.View style={buttonAnimatedStyle}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={{ elevation: 4 }}
      >
        <LinearGradient
          colors={activeGradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={[{ fontFamily: "Inter_700Bold" }, styles.buttonText]}>
              {title}
            </Text>
          )}
        </LinearGradient>
        <View
          style={[styles.buttonGlow, { shadowColor: colors.primary.main }]}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 26,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 17.5,
    letterSpacing: 1,
  },
  buttonGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    zIndex: -1,
    elevation: 10,
  },
});
