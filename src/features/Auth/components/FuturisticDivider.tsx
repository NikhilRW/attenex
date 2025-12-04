import { useTheme } from "@/src/shared/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface FuturisticDividerProps {
    text: string;
}

export const FuturisticDivider: React.FC<FuturisticDividerProps> = ({ text }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.dividerContainer}>
            <LinearGradient
                colors={["transparent", colors.surface.glassBorder, "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dividerLine}
            />
            <Text style={[styles.dividerText, { color: colors.text.muted }]}>{text}</Text>
            <LinearGradient
                colors={["transparent", colors.surface.glassBorder, "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dividerLine}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 32,
        gap: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
    },
});
