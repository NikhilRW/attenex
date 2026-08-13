import React from "react";
import { Text, View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { EaseView } from "react-native-ease";
import { withUnistyles } from "react-native-unistyles";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { styles } from "@settings/styles/Settings.styles";
import { DangerZoneSectionProps } from "@settings/types/props";

const DangerIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.accent.red,
}));

const ChevronIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

export const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({
  userProvider,
  onResetPassword,
  onLogout,
  onDeleteAccount,
}) => {
  return (
    <EaseView
      initialAnimate={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 120, stiffness: 900, mass: 4, delay: 400 }}
      style={styles.section}
    >
      <Text style={[styles.sectionTitle, styles.sectionTitleDanger]}>DANGER ZONE</Text>
      <View style={[styles.card, styles.dangerCard]}>
        {!userProvider ? (
          <>
            <TouchableOpacity style={styles.dangerRow} onPress={onResetPassword} haptic="impact">
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, styles.iconBoxDanger]}>
                  <DangerIcon name="key-outline" size={20} />
                </View>
                <View>
                  <Text style={styles.dangerLabel}>Change Password</Text>
                  <Text style={styles.dangerSub}>Change your account password</Text>
                </View>
              </View>
              <ChevronIcon name="chevron-forward" size={20} />
            </TouchableOpacity>

            <View style={styles.divider} />
          </>
        ) : null}

        <TouchableOpacity haptic="impact" style={styles.dangerRow} onPress={onLogout}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconBox, styles.iconBoxDanger]}>
              <DangerIcon name="log-out" size={20} />
            </View>
            <View>
              <Text style={styles.dangerLabel}>Logout</Text>
              <Text style={styles.dangerSub}>Sign out of account</Text>
            </View>
          </View>
          <ChevronIcon name="chevron-forward" size={20} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity haptic="impact" style={styles.dangerRow} onPress={onDeleteAccount}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconBox, styles.iconBoxDanger]}>
              <DangerIcon name="warning" size={20} />
            </View>
            <View>
              <Text style={styles.dangerLabel}>Delete Account</Text>
              <Text style={styles.dangerSub}>Permanently delete data</Text>
            </View>
          </View>
          <ChevronIcon name="chevron-forward" size={20} />
        </TouchableOpacity>
      </View>
    </EaseView>
  );
};
