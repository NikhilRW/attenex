import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { styles } from "@auth/styles/ForgotPassword.styles";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { withUnistyles } from "react-native-unistyles";

const BackIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.primary,
}));

const BackButton: React.FC = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={handleBackPress}
      haptic="selection"
    >
      <BackIcon name="arrow-back" size={24} />
    </TouchableOpacity>
  );
};

export default BackButton;
