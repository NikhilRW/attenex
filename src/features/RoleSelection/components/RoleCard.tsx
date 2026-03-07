import { styles } from "@role-selection/styles";
import { RoleCardProps } from "@role-selection/types";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";

export const RoleCard: React.FC<RoleCardProps> = ({
  imageSource,
  title,
  description,
  isSelected,
  isDisabled,
  scale,
  onPress,
}) => {
  return (
    <Pressable
      style={[styles.modelWrapper, isSelected && styles.modelWrapperSelected]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Animated.View
        style={[styles.canvasContainer, { transform: [{ scale }] }]}
      >
        <Image
          source={imageSource}
          style={styles.roleImage}
          contentFit="contain"
        />
      </Animated.View>
      <View style={styles.labelContainer}>
        <Text style={styles.roleLabel}>{title}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </Pressable>
  );
};
