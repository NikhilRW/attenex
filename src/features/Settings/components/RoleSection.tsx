import { ThemeOption } from "./ThemeOption";
import { styles } from "@settings/styles/Settings.styles";
import { RoleSectionProps } from "@settings/types/props";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export const RoleSection: React.FC<RoleSectionProps> = ({
  role,
  userRole,
  onRoleChange,
  onRoleUpdate,
  savingRole,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
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
                  :isActive
                    ? "people"
                    : "people-outline"
              }
              label={r.charAt(0).toUpperCase() + r.slice(1)}
            />
          );
        })}
      </View>
      {role !== userRole && (
        <Animated.View entering={FadeInDown.springify()}>
          <TouchableOpacity
            style={[styles.updateButton, styles.updateButtonPrimary]}
            onPress={async () => await onRoleUpdate()}
            disabled={savingRole}
          >
            <Text style={styles.updateButtonText}>
              {savingRole ? "Updating..." : "Confirm Role Change"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};
