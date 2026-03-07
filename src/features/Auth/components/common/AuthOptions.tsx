import { authOptionStyles as styles } from "@auth/styles";
import { AuthOptionsProps } from "@auth/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";

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
      <TouchableOpacity style={styles.rememberMe} onPress={onToggleRememberMe}>
        <View style={[styles.checkbox, rememberMe && styles.checkboxSelected]}>
          {rememberMe && <CheckIcon name="checkmark" size={12} />}
        </View>
        <Text style={styles.rememberText}>Remember me</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onForgotPassword}>
        <Text style={styles.forgotText}>Forgot Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthOptions;