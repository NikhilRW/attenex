import { FuturisticInputProps } from "@auth/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

const ThemedInputField = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.muted,
}));
const EyeIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.secondary,
}));
const InputBorder = withUnistyles(LinearGradient);

const FuturisticInput: React.FC<FuturisticInputProps> = ({
  label,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  error,
  ...textInputProps
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          error && styles.inputWrapperError,
        ]}
      >
        <ThemedInputField style={styles.input} {...textInputProps} />
        <InputBorder
          uniProps={(theme) => ({
            colors: error
              ? (["transparent", theme.accent.red, "transparent"] as const)
              : (["transparent", theme.primary.main, "transparent"] as const),
          })}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.inputBorder}
        />
        {isPassword && (
          <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIcon}>
            <EyeIcon
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginLeft: 4,
    color: theme.primary.main,
  },
  inputWrapper: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: theme.surface.cardBg,
    borderColor: theme.surface.glassBorder,
  },
  inputWrapperError: {
    borderColor: theme.status.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.text.primary,
  },
  inputBorder: {
    position: "absolute",
    bottom: -1,
    left: 20,
    right: 20,
    height: 1.5,
    opacity: 0.5,
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    color: theme.accent.red,
  },
}));

export default FuturisticInput;
