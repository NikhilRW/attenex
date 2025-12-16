import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/StudentDashboard.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";

const NoClassSelected = ({
  setShowClassModal,
}: {
  setShowClassModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="school-outline" size={64} color={colors.text.muted} />
      <Text style={[styles.emptyText, { color: colors.text.muted }]}>
        No class selected.
      </Text>
      <TouchableOpacity
        onPress={() => setShowClassModal(true)}
        style={[
          styles.refreshButton,
          {
            backgroundColor: colors.primary.main,
            borderRadius: 12,
            marginTop: 20,
          },
        ]}
      >
        <Text style={[styles.refreshText, { color: "white" }]}>
          Select Class
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoClassSelected;
