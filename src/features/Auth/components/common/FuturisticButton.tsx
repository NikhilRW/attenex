import { FuturisticButtonProps } from "@auth/types/props";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

const ButtonGradient = withUnistyles(LinearGradient);

const FuturisticButton: React.FC<FuturisticButtonProps> = ({
  title,
  onPress,
  gradient,
  disabled = false,
  loading = false,
}) => {
  const buttonScale = useSharedValue(1);

  const handlePressIn = () => {
    if (loading) return;
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
  };

  const handlePressOut = async () => {
    if (loading) return;
    buttonScale.value = withSpring(1);
    await onPress();
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: disabled || loading ? 0.6 : 1,
  }));

  return (
    <Animated.View style={buttonAnimatedStyle}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={async () => await handlePressOut()}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={{ elevation: 4 }}
      >
        <ButtonGradient
          uniProps={(theme) => ({
            colors: (gradient ?? [theme.primary.main, theme.accent.blue]) as [
              string,
              string,
              ...string[],
            ],
          })}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text
              style={[
                { fontFamily: "GoogleSansFlex_700Bold" },
                styles.buttonText,
              ]}
            >
              {title}
            </Text>
          )}
        </ButtonGradient>
        <View style={styles.buttonGlow} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create((theme) => ({
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
    shadowColor: theme.primary.main,
  },
}));

export default FuturisticButton;
