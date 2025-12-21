import {  Text } from "react-native";
import React from "react";
import { styles } from "../styles/ResetPassword.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";

const ResetPasswordFormHeader = ({ userName }: { userName: string }) => {
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
