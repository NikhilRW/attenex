import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface SocialLoginButtonsProps {
    onGooglePress?: () => void;
    onLinkedInPress?: () => void;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
    onGooglePress,
    onLinkedInPress,
}) => {
    return (
        <View style={styles.socialSection}>
            <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={onGooglePress}
            >
                <LinearGradient
                    colors={['#4286F414', '#34A85314', '#FBBC0514', '#EA433514']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.socialButton, styles.googleGradient]}
                >
                    <View style={styles.socialIconWrapper}>
                        <Ionicons name="logo-google" size={24} color="#FFF" />
                    </View>
                    <Text style={styles.socialButtonText}>Google</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.socialButton, styles.linkedinButton]}
                activeOpacity={0.8}
                onPress={onLinkedInPress}
            >
                <View style={styles.socialIconWrapper}>
                    <Ionicons name="logo-linkedin" size={24} color="#FFF" />
                </View>
                <Text style={styles.socialButtonText}>LinkedIn</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    socialSection: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 32,
    },
    socialButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    googleButton: {
        backgroundColor: "rgba(219 205 55 / 0.2)",
        borderColor: "rgba(219 189 55 / 0.4)",
    },
    googleGradient: {
    },
    linkedinButton: {
        backgroundColor: "rgba(0, 119, 181, 0.2)",
        borderColor: "rgba(0, 119, 181, 0.4)",
    },
    socialIconWrapper: {
        marginRight: 12,
    },
    socialButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    socialButtonGlow: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255,255,255,0.05)",
        zIndex: -1,
    },
});
