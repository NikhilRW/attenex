import UniLinearGradient from "@/shared/components/UniLinearGradient";
import { styles } from "@auth/styles/ResetPassword.styles";
import { PasswordRequirementsProps } from "@auth/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const RequirementIcon = withUnistyles(Ionicons);

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  confirmPassword,
}) => {
  const requirements = useMemo(() => [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /(?=.*[A-Z])/.test(password) },
    { label: "One lowercase letter", valid: /(?=.*[a-z])/.test(password) },
    { label: "One number", valid: /(?=.*\d)/.test(password) },
    {
      label: "Passwords match",
      valid: !!password && password === confirmPassword,
    },
  ],[confirmPassword,password]);

  return (
    <UniLinearGradient
      uniProps={(_theme, rt) => ({
        colors:
          rt.themeName === "dark"
            ? (["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"] as const)
            : (["rgba(255,255,255,0.9)", "rgba(255,255,255,0.5)"] as const),
      })}
      style={{ borderRadius: 12 }}
    >
      <View style={styles.requirementsContainer}>
        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
        {requirements.map((req) => (
          <View key={`${req.label}`} style={styles.requirementItem}>
            <RequirementIcon
              name={req.valid ? "checkmark-circle" : "ellipse-outline"}
              size={16}
              uniProps={(theme) => ({
                color: req.valid ? theme.status.success : theme.text.muted,
              })}
            />
            <Text style={styles.requirementText}>{req.label}</Text>
          </View>
        ))}
      </View>
    </UniLinearGradient>
  );
};

export default PasswordRequirements;
