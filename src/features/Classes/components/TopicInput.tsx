import React from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "../styles/CreateLecture.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";

interface TopicInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const TopicInput: React.FC<TopicInputProps> = ({
  value,
  onChangeText,
}) => {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";

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
