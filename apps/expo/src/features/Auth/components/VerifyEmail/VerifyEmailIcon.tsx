import React from "react";
import { View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { withUnistyles } from "react-native-unistyles";

import { styles } from "@auth/styles/VerifyEmail.style";

const VerifyIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const VerifyEmailIcon = () => {
  return (
    <View style={styles.iconContainer}>
      <VerifyIcon name="mail-outline" size={64} />
    </View>
  );
};

export default VerifyEmailIcon;
