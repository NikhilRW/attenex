import { useTheme } from "@/src/shared/hooks/useTheme";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AuthHeaderProps {
    title: string;
    logoSource: any;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, logoSource }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.headerContainer}>
            <View style={[styles.iconContainer, { backgroundColor: colors.surface.glass }]}>
                <Image
                    source={logoSource}
                    style={styles.logo}
                />
            </View>
            <Text style={[styles.welcomeText, { color: colors.text.primary }]}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    iconContainer: {
        width: 80,
        height: 80,
        marginBottom: 24,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 16,
    },
    logo: {
        width: 90,
        height: 90,
        borderRadius: 12,
        opacity: 0.9,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: "800",
        letterSpacing: 1,
        marginBottom: 8,
    },
});
