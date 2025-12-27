import { ThemeOption } from "@settings/components";
import { settingsStyles as styles } from "@settings/styles";
import { RoleSectionProps } from "@settings/types";
import { useTheme } from "@shared/hooks";
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
    const { colors } = useTheme();

    return (
        <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={styles.section}
        >
            <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>
                ROLE
            </Text>
            <View style={styles.roleContainer}>
                {(["teacher", "student"] as const).map((r) => {
                    const isActive = role === r;
                    return (
                        <ThemeOption
                            key={r}
                            mode={r}
                            isActive={isActive}
                            onPress={() => onRoleChange(r)}
                            icon={r === "teacher" ? "school" : "people"}
                            label={r.charAt(0).toUpperCase() + r.slice(1)}
                        />
                    );
                })}
            </View>
            {role !== userRole && (
                <Animated.View entering={FadeInDown.springify()}>
                    <TouchableOpacity
                        style={[
                            styles.updateButton,
                            { backgroundColor: colors.primary.main },
                        ]}
                        onPress={onRoleUpdate}
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
