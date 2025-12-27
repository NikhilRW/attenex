import { createLectureStyles as styles } from "@classes/styles";
import { TopicInputProps } from "@classes/types";
import { useTheme } from "@shared/hooks";
import React from "react";
import { Text, TextInput, View } from "react-native";

export const TopicInput: React.FC<TopicInputProps> = ({
  value,
  onChangeText,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.inputGroup, { zIndex: 10 }]}>
      <Text style={[styles.label, { color: colors.text.secondary }]}>
        Lecture Topic
      </Text>
      <TextInput
        style={[
          styles.textInput,
          {
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.2)"
              : "rgba(255, 255, 255, 0.5)",
            borderColor: colors.surface.glassBorder,
            color: colors.text.primary,
          },
        ]}
        placeholder="Enter lecture topic"
        placeholderTextColor={colors.text.muted}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};
