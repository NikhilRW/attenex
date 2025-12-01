import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AuthHeaderProps {
    title: string;
    logoSource: any;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, logoSource }) => {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
                <Image
                    source={logoSource}
                    style={styles.logo}
                />
            </View>
            <Text style={styles.welcomeText}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    iconContainer: {
        width: 60,
        height: 60,
        marginBottom: 24,
        justifyContent: "center",
        alignItems: "center",
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
        color: "#FFF",
        letterSpacing: 1,
        marginBottom: 8,
    },
});
