import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { styles } from "@classes/styles/LectureEndedScreen.styles";
import { LectureEndedHeaderProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const BackIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.primary,
}));

export const LectureEndedHeader: React.FC<LectureEndedHeaderProps> = ({
  onDone,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(100).springify()}
      style={styles.header}
    >
      <TouchableOpacity onPress={onDone} haptic="selection" style={styles.backButton}>
        <BackIcon name="arrow-back" size={24} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Lecture Ended</Text>
      <View style={styles.headerSpacer} />
    </Animated.View>
  );
};
