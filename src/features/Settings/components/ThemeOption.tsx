import { triggerImpactHapticOn } from "@/shared/utils/haptics";
import Ionicons from "@react-native-vector-icons/ionicons";
import { styles } from "@settings/styles/Settings.styles";
import { ThemeOptionProps } from "@settings/types/props";
import { Pressable, Text } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OptionIcon = withUnistyles(Ionicons);

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
      onPress={triggerImpactHapticOn(onPress)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.optionCard(isActive), animatedContainerStyle]}
    >
      <Animated.View
        style={[styles.optionIconContainer(isActive), animatedIconStyle]}
      >
        <OptionIcon
          // TODO: correct type add it
          name={icon as any}
          size={24}
          uniProps={(theme) => ({
            color: isActive ? "#FFF" : theme.text.muted,
          })}
        />
      </Animated.View>
      <Text style={styles.optionText(isActive)}>{label}</Text>
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
