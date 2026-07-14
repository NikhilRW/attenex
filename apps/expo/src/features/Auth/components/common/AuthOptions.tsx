import React from "react";
import { Text, View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { withUnistyles } from "react-native-unistyles";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { styles } from "@auth/styles/AuthOption.styles";
import { AuthOptionsProps } from "@auth/types/props";

const CheckIcon = withUnistyles(Ionicons, () => ({
  color: "#FFF",
}));

const AuthOptions: React.FC<AuthOptionsProps> = ({
  rememberMe,
  onToggleRememberMe,
  onForgotPassword,
}) => {
  return (
    <View style={styles.optionsRow}>
      <TouchableOpacity style={styles.rememberMe} onPress={onToggleRememberMe} haptic="selection">
        <View style={[styles.checkbox, rememberMe && styles.checkboxSelected]}>
          {rememberMe ? <CheckIcon name="checkmark" size={12} /> : null}
        </View>
        <Text style={styles.rememberText}>Remember me</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onForgotPassword} haptic="selection">
        <Text style={styles.forgotText}>Forgot Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthOptions;
