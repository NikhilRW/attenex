import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { withUnistyles } from "react-native-unistyles";

import styles from "@attendance/styles/StudentDashboard.styles";

const PrimarySpinner = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.primary.main,
}));

const LoadingScreen = () => {
  return (
    <View style={[styles.screenContainer, styles.centeredContainer]}>
      <PrimarySpinner size="large" />
      <Text style={styles.loadingText}>Loading lecture details...</Text>
    </View>
  );
};

export default LoadingScreen;
