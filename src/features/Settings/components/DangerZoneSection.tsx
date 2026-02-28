import Ionicons from "@react-native-vector-icons/ionicons";
import { settingsStyles as styles } from "@settings/styles";
import { DangerZoneSectionProps } from "@settings/types";
import { useTheme } from "@shared/hooks";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({
  userProvider,
  onResetPassword,
  onLogout,
  onDeleteAccount,
}) => {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(400).springify()}
      style={styles.section}
    >
      <Text style={[styles.sectionTitle, { color: colors.accent.red }]}>
        DANGER ZONE
      </Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            borderColor: "rgba(239, 68, 68, 0.2)",
          },
        ]}
      >
        {!userProvider && (
          <>
            <TouchableOpacity
              style={styles.dangerRow}
              onPress={onResetPassword}
            >
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                  ]}
                >
                  <Ionicons
                    name="key-outline"
                    size={20}
                    color={colors.accent.red}
                  />
                </View>
                <View>
                  <Text
                    style={[styles.dangerLabel, { color: colors.text.primary }]}
                  >
                    Change Password
                  </Text>
                  <Text
                    style={[styles.dangerSub, { color: colors.text.muted }]}
                  >
                    Change your account password
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.muted}
              />
            </TouchableOpacity>

            <View
              style={[
                styles.divider,
                { backgroundColor: colors.surface.glassBorder },
              ]}
            />
          </>
        )}

        <TouchableOpacity style={styles.dangerRow} onPress={onLogout}>
          <View style={styles.rowLeft}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: "rgba(239, 68, 68, 0.1)" },
              ]}
            >
              <Ionicons name="log-out" size={20} color={colors.accent.red} />
            </View>
            <View>
              <Text
                style={[styles.dangerLabel, { color: colors.text.primary }]}
              >
                Logout
              </Text>
              <Text style={[styles.dangerSub, { color: colors.text.muted }]}>
                Sign out of account
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text.muted}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.surface.glassBorder },
          ]}
        />

        <TouchableOpacity style={styles.dangerRow} onPress={onDeleteAccount}>
          <View style={styles.rowLeft}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: "rgba(239, 68, 68, 0.1)" },
              ]}
            >
              <Ionicons name="warning" size={20} color={colors.accent.red} />
            </View>
            <View>
              <Text
                style={[styles.dangerLabel, { color: colors.text.primary }]}
              >
                Delete Account
              </Text>
              <Text style={[styles.dangerSub, { color: colors.text.muted }]}>
                Permanently delete data
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text.muted}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
