import { colors } from "@/src/shared/constants/colors";
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
    return (
        <View style={styles.footer}>
            <Text style={styles.footerText}>{text}</Text>
            <TouchableOpacity onPress={onLinkPress}>
                <Text style={styles.signUpLink}>{linkText}</Text>
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
        color: "rgba(255,255,255,0.6)",
        fontSize: 14,
    },
    signUpLink: {
        color: colors.primary.main,
        fontSize: 14,
        fontWeight: "700",
    },
});
