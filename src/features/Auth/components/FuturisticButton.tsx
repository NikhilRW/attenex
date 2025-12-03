import { colors } from "@/src/shared/constants/colors";
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
  gradient = [colors.primary.main, colors.accent.blue],
  disabled = false,
  loading = false,
}) => {
  const buttonScale = useSharedValue(1);

  const handlePress = () => {
    if (loading) return;
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
    onPress();
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: disabled || loading ? 0.6 : 1,
  }));

  return (
    <Animated.View style={buttonAnimatedStyle}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={gradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>{title}</Text>
          )}
          <View style={styles.buttonGlow} />
        </LinearGradient>
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
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },
  buttonGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    zIndex: -1,
  },
});
