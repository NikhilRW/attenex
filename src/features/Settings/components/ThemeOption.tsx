import Ionicons from "@react-native-vector-icons/ionicons";
import { settingsStyles as styles } from "@settings/styles";
import { ThemeOptionProps } from "@settings/types";
import * as Haptics from "expo-haptics";
import { Pressable, Text } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
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
  const { theme } = useUnistyles();

  const rotation = useDerivedValue(() => {
    if (isActive) {
      return withSequence(withSpring(360, { duration: 200, dampingRatio: 4 }));
    }
    return 0;
  });

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
