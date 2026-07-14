import React from "react";
import { Text, View } from "react-native";

import { NitroImage } from "react-native-nitro-image";
import { StyleSheet } from "react-native-unistyles";

import { AuthHeaderProps } from "@auth/types/props";

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, logoSource }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.iconContainer}>
        <NitroImage image={logoSource} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.welcomeText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
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
    backgroundColor: theme.surface.glass,
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
    color: theme.text.primary,
  },
}));

export default AuthHeader;
