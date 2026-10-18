import { useState } from "react";
import { Switch, Text, View } from "react-native";

import { withUnistyles } from "react-native-unistyles";

import { styles } from "@settings/styles/Settings.styles";

const AttendanceSwitch = withUnistyles(Switch, (theme) => ({
  trackColor: {
    false: theme.surface.glassBorder,
    true: theme.primary.main,
  },
  thumbColor: theme.text.primary,
}));

export const SelfAttendanceSection = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ATTENDANCE</Text>
      <View style={[styles.card, styles.cardSurface, styles.row]}>
        <Text style={[styles.rowLabel, styles.rowLabelPrimary]}>Self attendance</Text>
        <AttendanceSwitch
          accessibilityLabel="Self attendance"
          value={enabled}
          onValueChange={setEnabled}
        />
      </View>
    </View>
  );
};
