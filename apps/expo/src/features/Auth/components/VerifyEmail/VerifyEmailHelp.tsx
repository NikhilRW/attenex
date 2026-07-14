import React from "react";
import { Text, View } from "react-native";

import { styles } from "@auth/styles/VerifyEmail.style";

const VerifyEmailHelp = () => {
  return (
    <View style={styles.helpContainer}>
      <Text style={styles.helpText}>Need help?</Text>
      <Text style={styles.contactText}>Contact support if you don&apos;t receive the email</Text>
    </View>
  );
};

export default VerifyEmailHelp;
