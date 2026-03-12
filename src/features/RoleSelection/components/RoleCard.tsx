import { styles } from "@role-selection/styles";
import { RoleCardProps } from "@role-selection/types";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { NitroImage } from "react-native-nitro-image";
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
        <NitroImage
          image={imageSource}
          style={styles.roleImage}
          resizeMode="contain"
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
