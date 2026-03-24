import styles from "@attendance/styles/StudentDashboard.styles";
import { ClassInfoProps } from "@attendance/types/props";
import { User } from "@backend/config/database_setup";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const ClassInfoGradient = withUnistyles(LinearGradient, (_theme, rt) => ({
  colors:
    rt.colorScheme === "dark"
      ? (["rgba(8, 145, 178, 0.15)", "rgba(8, 145, 178, 0.05)"] as const)
      : (["rgba(8, 145, 178, 0.1)", "rgba(8, 145, 178, 0.05)"] as const),
}));

const PrimaryIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const ClassInfo = ({ user, setShowClassModal }: ClassInfoProps) => {
  return (
    <ClassInfoGradient style={styles.classInfoCard}>
      <View style={styles.classInfoHeader}>
        <View style={styles.classInfoLeft}>
          <PrimaryIcon
            name="school"
            size={24}
            style={styles.classInfoIcon}
          />
          <View>
            <Text style={styles.classInfoLabel}>Your Class</Text>
            <Text style={styles.classInfoValue}>
              {(user as User)?.className || "Not Set"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setShowClassModal(true)}
          style={styles.editClassButton}
        >
          <PrimaryIcon name="pencil" size={18} />
        </TouchableOpacity>
      </View>
    </ClassInfoGradient>
  );
};

export default ClassInfo;
