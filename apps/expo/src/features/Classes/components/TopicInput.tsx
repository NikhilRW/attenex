import React from "react";
import { Text, TextInput, View } from "react-native";

import { withUnistyles } from "react-native-unistyles";

import { styles } from "@classes/styles/CreateLecture.styles";
import { TopicInputProps } from "@classes/types/props";

const TopicInputField = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.muted,
}));

export const TopicInput: React.FC<TopicInputProps> = ({ value, onChangeText }) => {
  return (
    <View style={[styles.inputGroup, styles.inputGroupTopic]}>
      <Text style={styles.label}>Lecture Topic</Text>
      <TopicInputField
        style={styles.textInput}
        testID="CREATE_LECTURE_SCREEN.LECTURE_TOPIC_INPUT"
        placeholder="Enter lecture topic"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};
