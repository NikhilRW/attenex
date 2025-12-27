import { classesStyles as styles } from "@classes/styles";
import { CreateLectureFormProps } from "@classes/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shared/hooks";
import React from "react";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export const CreateLectureForm: React.FC<CreateLectureFormProps> = ({
    lectureName,
    setLectureName,
    className,
    setClassName,
    isCreating,
    onCreateLecture,
}: CreateLectureFormProps) => {
    const { colors } = useTheme();

    return (
        <Animated.View
            entering={FadeInUp.duration(600).delay(200).springify()}
            style={[styles.card, { backgroundColor: colors.surface.cardBg }]}
        >
            {/* Lecture Name Input */}
            <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                    Lecture Name
                </Text>
                <View
                    style={[
                        styles.inputWrapper,
                        {
                            backgroundColor: colors.background.tertiary,
                            borderColor: colors.surface.glassBorder,
                        },
                    ]}
                >
                    <Ionicons
                        name="bookmark-outline"
                        size={20}
                        color={colors.text.secondary}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={[styles.input, { color: colors.text.primary }]}
                        placeholder="e.g., Introduction to React Native"
                        placeholderTextColor={colors.text.secondary}
                        value={lectureName}
                        onChangeText={setLectureName}
                        editable={!isCreating}
                    />
                </View>
            </View>

            {/* Class Name Input */}
            <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                    Class Name
                </Text>
                <View
                    style={[
                        styles.inputWrapper,
                        {
                            backgroundColor: colors.background.tertiary,
                            borderColor: colors.surface.glassBorder,
                        },
                    ]}
                >
                    <Ionicons
                        name="people-outline"
                        size={20}
                        color={colors.text.secondary}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={[styles.input, { color: colors.text.primary }]}
                        placeholder="e.g., Computer Science 101"
                        placeholderTextColor={colors.text.secondary}
                        value={className}
                        onChangeText={setClassName}
                        editable={!isCreating}
                    />
                </View>
            </View>

            {/* Create Button */}
            <TouchableOpacity
                style={[
                    styles.createButton,
                    {
                        backgroundColor: colors.primary.main,
                        opacity: isCreating ? 0.7 : 1,
                    },
                ]}
                onPress={onCreateLecture}
                disabled={isCreating}
                activeOpacity={0.8}
            >
                {isCreating ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <>
                        <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                        <Text style={styles.createButtonText}>Create Lecture</Text>
                    </>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};
