import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button } from "react-native-paper";
import { onlineManager } from "@tanstack/react-query";
import { colors } from "@/shared/constants/colors";

const Test = () => {
  const [isOnline, setIsOnline] = useState<boolean>(onlineManager.isOnline());
  const toggleOnlineMode = () => {
    onlineManager.setOnline(!isOnline);
    setIsOnline(!isOnline);
  };
  return (
    <View style={styles.container}>
      <Button contentStyle={styles.button} dark onPress={toggleOnlineMode}>
        <Text style={styles.buttonText}>
          Toggle {isOnline ? "off" : "on"} online mode{" "}
        </Text>
      </Button>
    </View>
  );
};

export default Test;

export const styles = StyleSheet.create({
  buttonText: {
    color: "black",
  },
  button: {
    backgroundColor: colors.background.overlay,
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
