import { authOptionStyles as styles } from "@auth/styles";
import { AuthOptionsProps } from "@auth/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shared/hooks/useTheme";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const AuthOptions: React.FC<AuthOptionsProps> = ({
  rememberMe,
  onToggleRememberMe,
  onForgotPassword,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.optionsRow}>
      <TouchableOpacity style={styles.rememberMe} onPress={onToggleRememberMe}>
        <View
          style={[
            styles.checkbox,
            { borderColor: colors.text.muted },
            rememberMe && {
              backgroundColor: colors.primary.main,
              borderColor: colors.primary.main,
            },
          ]}
        >
          {rememberMe && <Ionicons name="checkmark" size={12} color="#FFF" />}
        </View>
        <Text style={[styles.rememberText, { color: colors.text.secondary }]}>
          Remember me
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onForgotPassword}>
        <Text style={[styles.forgotText, { color: colors.primary.main }]}>
          Forgot Password
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthOptions;