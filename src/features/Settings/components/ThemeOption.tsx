import Ionicons from "@react-native-vector-icons/ionicons";
import { settingsStyles as styles } from "@settings/styles";
import { ThemeOptionProps } from "@settings/types";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useUnistyles, withUnistyles } from "react-native-unistyles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OptionIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

const CheckIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

export const ThemeOption: React.FC<ThemeOptionProps> = ({
  isActive,
  onPress,
  icon,
  label,
}) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const { theme } = useUnistyles();

  useEffect(() => {
    if (isActive) {
      rotation.value = withSequence(
        withSpring(360, { duration: 200, dampingRatio: 4 }),
      );
    } else {
      rotation.value = withTiming(0, { duration: 0 });
    }
  }, [isActive, rotation]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.optionCard,
        animatedContainerStyle,
        isActive ? styles.optionCardActive : styles.optionCardInactive,
      ]}
    >
      <Animated.View
        style={[
          styles.roleIcon,
          animatedIconStyle,
          isActive ? styles.optionIconActive : styles.optionIconInactive,
        ]}
      >
        <OptionIcon
          name={icon as any}
          size={24}
          color={isActive ? "#FFF" : theme.text.muted}
        />
      </Animated.View>
      <Text
        style={[
          styles.roleText,
          isActive ? styles.optionTextActive : styles.optionTextInactive,
        ]}
      >
        {label}
      </Text>
      {isActive && (
        <Animated.View
          entering={FadeInDown.springify()}
          style={styles.checkIcon}
        >
          <CheckIcon name="checkmark-circle" size={20} />
        </Animated.View>
      )}
    </AnimatedPressable>
  );
};
