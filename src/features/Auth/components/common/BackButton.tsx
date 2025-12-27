import { forgotPasswordStyles as styles } from "@auth/styles";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shared/hooks/useTheme";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

const BackButton: React.FC = () => {
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
