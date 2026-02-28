import Ionicons from "@react-native-vector-icons/ionicons";
import { settingsStyles as styles } from "@settings/styles";
import { ThemeOptionProps } from "@settings/types";
import { useTheme } from "@shared/hooks";
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ThemeOption: React.FC<ThemeOptionProps> = ({
    isActive,
    onPress,
    icon,
    label,
}) => {
    const { colors } = useTheme();
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (isActive) {
            rotation.value = withSequence(
                withSpring(360, { duration: 200, dampingRatio: 4 })
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
                styles.roleCard,
                animatedContainerStyle,
                {
                    backgroundColor: isActive
                        ? "rgba(0, 212, 255, 0.15)"
                        : colors.surface.cardBg,
                    borderColor: isActive
                        ? colors.primary.main
                        : colors.surface.glassBorder,
                },
            ]}
        >
            <Animated.View
                style={[
                    styles.roleIcon,
                    animatedIconStyle,
                    {
                        backgroundColor: isActive
                            ? colors.primary.main
                            : colors.surface.glass,
                    },
                ]}
            >
                <Ionicons
                    name={icon as any}
                    size={24}
                    color={isActive ? "#FFF" : colors.text.muted}
                />
            </Animated.View>
            <Text
                style={[
                    styles.roleText,
                    {
                        color: isActive ? colors.text.primary : colors.text.secondary,
                    },
                ]}
            >
                {label}
            </Text>
            {isActive && (
                <Animated.View
                    entering={FadeInDown.springify()}
                    style={styles.checkIcon}
                >
                    <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={colors.primary.main}
                    />
                </Animated.View>
            )}
        </AnimatedPressable>
    );
};
