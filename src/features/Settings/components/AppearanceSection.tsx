import { ThemeOption } from "@settings/components/ThemeOption";
import { settingsStyles as styles } from "@settings/styles";
import { AppearanceSectionProps } from "@settings/types";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
    mode,
    onThemeChange,
}) => {
    return (
        <Animated.View
            entering={FadeInDown.delay(300).springify()}
            style={styles.section}
        >
            <Text style={styles.sectionTitle}>APPEARANCE</Text>
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
