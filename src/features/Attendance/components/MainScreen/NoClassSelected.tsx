import { styles } from "@attendance/styles";
import { NoClassSelectedProps } from "@attendance/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shared/hooks/useTheme";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const NoClassSelected = ({ setShowClassModal }: NoClassSelectedProps) => {
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
