import { colors } from "@/src/shared/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface FuturisticInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  error?: string; // Error message from react-hook-form
}

export const FuturisticInput: React.FC<FuturisticInputProps> = ({
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
      <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(255,255,255,0.4)"
          {...textInputProps}
        />
        <LinearGradient
          colors={
            error
              ? ["transparent", "#ff3b3b", "transparent"]
              : ["transparent", colors.primary.main, "transparent"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.inputBorder}
        />
        {isPassword && (
          <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIcon}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="rgba(255,255,255,0.6)"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: colors.primary.main,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginLeft: 4,
  },
  inputWrapper: {
    height: 56,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
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
  inputWrapperError: {
    borderColor: "rgba(255, 59, 59, 0.5)",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginLeft: 4,
    marginTop: 4,
    fontWeight: "500",
  },
});
