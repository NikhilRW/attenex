import UniLinearGradient from "@/shared/components/UniLinearGradient";
import { triggerImpactHapticOn } from "@/shared/utils/haptics";
import { FuturisticButtonProps } from "@auth/types/props";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";


const FuturisticButton: React.FC<FuturisticButtonProps> = ({
  title,
  onPress,
  gradient,
  disabled = false,
  loading = false,
  testID = "futuristic-button",
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
    // TODO: think about the parameter.
    triggerImpactHapticOn()("" as any);
    await onPress();
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: disabled || loading ? 0.6 : 1,
  }));

  return (
    <Animated.View style={buttonAnimatedStyle}>
      <TouchableOpacity
        testID={testID}
        onPressIn={handlePressIn}
        onPressOut={async () => await handlePressOut()}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={styles.buttonPressable}
      >
        <UniLinearGradient
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
            <Text style={styles.buttonText}>{title}</Text>
          )}
          <View style={styles.buttonGlow} />
        </UniLinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// TODO: get it to the right place.

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
    fontSize: 18,
    letterSpacing: 0.4,
    fontFamily: "Inter_700Bold",
  },
  buttonPressable: {},
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
    boxShadow: [
      {
        blurRadius: 16,
        offsetX: 0,
        offsetY: 0,
        color: `${theme.primary.main}60`,
      },
    ],
    shadowColor: theme.primary.main,
  },
}));

export default FuturisticButton;
