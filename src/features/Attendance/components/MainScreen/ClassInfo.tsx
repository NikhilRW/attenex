import { styles } from "@attendance/styles";
import { ClassInfoProps } from "@attendance/types/props";
import { User } from "@backend/config/database_setup";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shared/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ClassInfo = ({ user, setShowClassModal }: ClassInfoProps) => {
  const { isDark, colors } = useTheme();
  return (
    <LinearGradient
      colors={
        isDark
          ? ["rgba(8, 145, 178, 0.15)", "rgba(8, 145, 178, 0.05)"]
          : ["rgba(8, 145, 178, 0.1)", "rgba(8, 145, 178, 0.05)"]
      }
      style={[
        styles.classInfoCard,
        { borderColor: colors.surface.glassBorder },
      ]}
    >
      <View style={styles.classInfoHeader}>
        <View style={styles.classInfoLeft}>
          <Ionicons
            name="school"
            size={24}
            color={colors.primary.main}
            style={{ marginRight: 12 }}
          />
          <View>
            <Text
              style={[styles.classInfoLabel, { color: colors.text.secondary }]}
            >
              Your Class
            </Text>
            <Text
              style={[styles.classInfoValue, { color: colors.text.primary }]}
            >
              {(user as User)?.className || "Not Set"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setShowClassModal(true)}
          style={[
            styles.editClassButton,
            {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            },
          ]}
        >
          <Ionicons name="pencil" size={18} color={colors.primary.main} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ClassInfo;
