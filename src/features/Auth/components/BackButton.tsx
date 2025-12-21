import { TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/ForgotPassword.styles";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/shared/hooks/useTheme";

const BackButton = () => {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.backButton, { backgroundColor: colors.surface.glass }]}
      onPress={() => router.back()}
    >
      <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
    </TouchableOpacity>
  );
};

export default BackButton;