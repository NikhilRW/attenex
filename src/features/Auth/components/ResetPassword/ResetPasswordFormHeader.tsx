import { resetPasswordStyles as styles } from "@auth/styles";
import { ResetPasswordFormHeaderProps } from "@auth/types/props";
import React from "react";
import { Text } from "react-native";

const ResetPasswordFormHeader: React.FC<ResetPasswordFormHeaderProps> = ({
  userName,
}) => {
  return (
    <>
      {userName && <Text style={styles.greeting}>Hi {userName}!</Text>}
      <Text style={styles.description}>
        Enter your new password below. Make it strong and memorable.
      </Text>
    </>
  );
};

export default ResetPasswordFormHeader;
