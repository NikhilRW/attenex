import { View, Text } from "react-native";
import React from "react";
import { showMessage } from "react-native-flash-message";

const RoleSelection = () => {
  const dobro = () => {
    showMessage({
      message: "Role Selected",
      description: `You have selected the role successfully.`,
      type: "success",
      duration: 2500,
      position: "top",
      floating: true,
      statusBarHeight: 26,
    });
  };
  return (
    <View>
      <Text onPress={dobro}>RoleSelection</Text>
    </View>
  );
};

export default RoleSelection;
