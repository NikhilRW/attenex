import { forgotPasswordStyles as styles } from "@auth/styles";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const BackIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.primary,
}));

const BackButton: React.FC = () => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <BackIcon name="arrow-back" size={24} />
    </TouchableOpacity>
  );
};

export default BackButton;
