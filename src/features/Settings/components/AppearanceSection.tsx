import { ThemeOption } from "@settings/components";
import { settingsStyles as styles } from "@settings/styles";
import { AppearanceSectionProps } from "@settings/types";
import { useTheme } from "@shared/hooks";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
    mode,
    onThemeChange,
}) => {
    const { colors } = useTheme();

    return (
        <Animated.View
            entering={FadeInDown.delay(300).springify()}
            style={styles.section}
        >
            <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>
                APPEARANCE
            </Text>
            <View style={styles.roleContainer}>
                {(["light", "dark", "system"] as const).map((m) => {
                    const isActive = mode === m;
                    return (
                        <ThemeOption
                            key={m}
                            mode={m}
                            isActive={isActive}
                            onPress={() => onThemeChange(m)}
                            icon={
                                m === "light"
                                    ? "sunny"
                                    : m === "dark"
                                        ? "moon"
                                        : "settings-outline"
                            }
                            label={m.charAt(0).toUpperCase() + m.slice(1)}
                        />
                    );
                })}
            </View>
        </Animated.View>
    );
};
