import React from "react";
import { Text } from "react-native";

import { styles } from "@auth/styles/ResetPassword.styles";
import { ResetPasswordFormHeaderProps } from "@auth/types/props";

const ResetPasswordFormHeader: React.FC<ResetPasswordFormHeaderProps> = ({ userName }) => {
  return (
    <>
      {userName ? <Text style={styles.greeting}>Hi {userName}!</Text> : null}
      <Text style={styles.description}>
        Enter your new password below. Make it strong and memorable.
      </Text>
    </>
  );
};

export default ResetPasswordFormHeader;
