import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import UniLinearGradient from "@/shared/components/UniLinearGradient";
import { triggerImpactHapticOn } from "@/shared/utils/haptics";
import { FuturisticButtonProps } from "@auth/types/props";

import { styles } from "../../styles/FuturisticButton.styles";

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
    buttonScale.set(
      withSpring(0.95, {}, () => {
        buttonScale.set(withSpring(1));
      }),
    );
  };

  const handlePressOut = async () => {
    if (loading) return;
    buttonScale.set(withSpring(1));
    triggerImpactHapticOn()();
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

export default FuturisticButton;
