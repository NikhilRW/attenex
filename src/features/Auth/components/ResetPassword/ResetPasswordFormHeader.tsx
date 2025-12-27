import { resetPasswordStyles as styles } from "@auth/styles";
import { ResetPasswordFormHeaderProps } from "@auth/types/props";
import { useTheme } from "@shared/hooks/useTheme";
import React from "react";
import { Text } from "react-native";

const ResetPasswordFormHeader: React.FC<ResetPasswordFormHeaderProps> = ({ userName }) => {
  const { colors } = useTheme();
  return (
    <>
      {userName && (
        <Text style={[styles.greeting, { color: colors.text.primary }]}>
          Hi {userName}!
        </Text>
      )}
      <Text style={[styles.description, { color: colors.text.secondary }]}>
        Enter your new password below. Make it strong and memorable.
      </Text>
    </>
  );
};

export default ResetPasswordFormHeader;
