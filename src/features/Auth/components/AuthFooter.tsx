import { useTheme } from "@/src/shared/hooks/useTheme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AuthFooterProps {
    text: string;
    linkText: string;
    onLinkPress: () => void;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
    text,
    linkText,
    onLinkPress,
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text.secondary }]}>
                {text}
            </Text>
            <TouchableOpacity onPress={onLinkPress}>
                <Text style={[styles.signUpLink, { color: colors.primary.main }]}>
                    {linkText}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 40,
    },
    footerText: {
        fontSize: 14,
    },
    signUpLink: {
        fontSize: 14,
        fontWeight: "700",
    },
});
