import { useTheme } from "@/src/shared/hooks/useTheme";
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
  const { colors } = useTheme();

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.primary.main }]}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        {
          backgroundColor: colors.surface.cardBg,
          borderColor: error ? colors.status.error : colors.surface.glassBorder
        }
      ]}>
        <TextInput
          style={[styles.input, { color: colors.text.primary }]}
          placeholderTextColor={colors.text.muted}
          {...textInputProps}
        />
        <LinearGradient
          colors={
            error
              ? ["transparent", colors.accent.red, "transparent"]
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
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[styles.errorText, { color: colors.accent.red }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginLeft: 4,
  },
  inputWrapper: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
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
});