import { styles } from "@role-selection/styles/RoleSelection.styles";
import { ConfirmButtonProps } from "@role-selection/types/props";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const ConfirmGradient = withUnistyles(LinearGradient);

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  selectedRole,
  isUpdating,
  userRole,
  bottomInset,
  onConfirm,
}) => {
  const getButtonText = () => {
    if (userRole) {
      return `You are ${userRole}`;
    }
    if (selectedRole) {
      return `Continue as ${selectedRole}`;
    }
    return "Select a role";
  };

  return (
    <TouchableOpacity
      style={[
        styles.confirmButton(bottomInset),
        (!selectedRole || isUpdating) && styles.confirmButtonDisabled,
      ]}
      onPress={onConfirm}
      disabled={!selectedRole || isUpdating}
      activeOpacity={0.8}
    >
      <ConfirmGradient
        uniProps={(theme) => ({
          colors:
            selectedRole && !isUpdating
              ? ([theme.primary.main, theme.accent.blue] as const)
              : ([theme.surface.glassBorder, theme.surface.glass] as const),
        })}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.confirmGradient}
      >
        {isUpdating ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text
            style={[
              styles.confirmButtonText,
              !selectedRole && !isUpdating && { opacity: 0.7 },
            ]}
          >
            {getButtonText()}
          </Text>
        )}
      </ConfirmGradient>
    </TouchableOpacity>
  );
};
