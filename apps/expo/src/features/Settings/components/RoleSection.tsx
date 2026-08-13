import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { EaseView } from "react-native-ease";

import { styles } from "@settings/styles/Settings.styles";
import { RoleSectionProps } from "@settings/types/props";

import { ThemeOption } from "./ThemeOption";

export const RoleSection: React.FC<RoleSectionProps> = ({
  role,
  userRole,
  onRoleChange,
  onRoleUpdate,
  savingRole,
}) => {
  return (
    <EaseView
      initialAnimate={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 120, stiffness: 900, mass: 4, delay: 200 }}
      style={styles.section}
    >
      <Text style={styles.sectionTitle}>ROLE</Text>
      <View style={styles.roleContainer}>
        {(["teacher", "student"] as const).map((r) => {
          const isActive = role === r;
          return (
            <ThemeOption
              key={r}
              mode={r}
              isActive={isActive}
              onPress={() => onRoleChange(r)}
              icon={
                r === "teacher"
                  ? isActive
                    ? "school"
                    : "school-outline"
                  : isActive
                    ? "people"
                    : "people-outline"
              }
              testID={`SETTINGS_SCREEN.${r.toUpperCase()}_ROLE_OPTION_BUTTON`}
              label={r.charAt(0).toUpperCase() + r.slice(1)}
            />
          );
        })}
      </View>
      {role !== userRole ? (
        <EaseView
          initialAnimate={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 120, stiffness: 900, mass: 4 }}
        >
          <TouchableOpacity
            style={[styles.updateButton, styles.updateButtonPrimary]}
            onPress={async () => await onRoleUpdate()}
            disabled={savingRole}
            testID="SETTINGS_SCREEN.CONFIRM_ROLE_CHANGE_BUTTON"
          >
            <Text style={styles.updateButtonText}>
              {savingRole ? "Updating..." : "Confirm Role Change"}
            </Text>
          </TouchableOpacity>
        </EaseView>
      ) : null}
    </EaseView>
  );
};
