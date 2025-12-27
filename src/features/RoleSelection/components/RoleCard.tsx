import { roleSelectionStyles as styles } from "@role-selection/styles";
import { RoleCardProps } from "@role-selection/types";
import { useTheme } from "@shared/hooks";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";

export const RoleCard: React.FC<RoleCardProps> = ({
    imageSource,
    title,
    description,
    isSelected,
    isDisabled,
    scale,
    onPress,
}) => {
    const { colors } = useTheme();

    return (
        <Pressable
            style={[
                styles.modelWrapper,
                {
                    backgroundColor: colors.surface.glass,
                    borderColor: colors.surface.glassBorder,
                },
                isSelected && {
                    borderColor: colors.primary.main,
                    backgroundColor: colors.primary.glow,
                },
            ]}
            onPress={onPress}
            disabled={isDisabled}
        >
            <Animated.View
                style={[styles.canvasContainer, { transform: [{ scale }] }]}
            >
                <Image
                    source={imageSource}
                    style={styles.roleImage}
                    contentFit="contain"
                />
            </Animated.View>
            <View
                style={[
                    styles.labelContainer,
                    { backgroundColor: colors.surface.cardBg },
                ]}
            >
                <Text style={[styles.roleLabel, { color: colors.text.primary }]}>
                    {title}
                </Text>
                <Text
                    style={[styles.roleDescription, { color: colors.text.secondary }]}
                >
                    {description}
                </Text>
            </View>
            {isSelected && (
                <View
                    style={[
                        styles.selectedIndicator,
                        {
                            backgroundColor: colors.primary.main,
                            shadowColor: colors.primary.main,
                        },
                    ]}
                >
                    <Text style={styles.checkmark}>✓</Text>
                </View>
            )}
        </Pressable>
    );
};
