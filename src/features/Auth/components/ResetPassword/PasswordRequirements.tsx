import { resetPasswordStyles as styles } from "@auth/styles";
import { PasswordRequirementsProps } from "@auth/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shared/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  confirmPassword,
}) => {
  const { colors, isDark } = useTheme();

  const requirements = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /(?=.*[A-Z])/.test(password) },
    { label: "One lowercase letter", valid: /(?=.*[a-z])/.test(password) },
    { label: "One number", valid: /(?=.*\d)/.test(password) },
    {
      label: "Passwords match",
      valid: !!password && password === confirmPassword,
    },
  ];

  return (
    <LinearGradient
      colors={
        isDark
          ? ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]
          : ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.5)"]
      }
      style={{ borderRadius: 12 }}
    >
      <View style={styles.requirementsContainer}>
        <Text
          style={[styles.requirementsTitle, { color: colors.primary.main }]}
        >
          Password Requirements:
        </Text>
        {requirements.map((req, index) => (
          <View key={index} style={styles.requirementItem}>
            <Ionicons
              name={req.valid ? "checkmark-circle" : "ellipse-outline"}
              size={16}
              color={req.valid ? colors.status.success : colors.text.muted}
            />
            <Text
              style={[styles.requirementText, { color: colors.text.secondary }]}
            >
              {req.label}
            </Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
};

export default PasswordRequirements;
