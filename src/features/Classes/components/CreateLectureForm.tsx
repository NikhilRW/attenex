import { classesStyles as styles } from "@classes/styles";
import { CreateLectureFormProps } from "@classes/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const SecondaryIcon = withUnistyles(Ionicons, (theme) => ({
    color: theme.text.secondary,
}));

const PrimaryTextInput = withUnistyles(TextInput, (theme) => ({
    placeholderTextColor: theme.text.secondary,
}));

const PrimarySpinner = withUnistyles(ActivityIndicator, (theme) => ({
    color: theme.text.primary,
}));

const PrimaryTextIcon = withUnistyles(Ionicons, (theme) => ({
    color: theme.text.primary,
}));

export const CreateLectureForm: React.FC<CreateLectureFormProps> = ({
    lectureName,
    setLectureName,
    className,
    setClassName,
    isCreating,
    onCreateLecture,
}: CreateLectureFormProps) => {
    return (
        <Animated.View
            entering={FadeInUp.duration(600).delay(200).springify()}
            style={styles.card}
        >
            {/* Lecture Name Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>
                    Lecture Name
                </Text>
                <View style={styles.inputWrapper}>
                    <SecondaryIcon
                        name="bookmark-outline"
                        size={20}
                        style={styles.inputIcon}
                    />
                    <PrimaryTextInput
                        style={styles.input}
                        placeholder="e.g., Introduction to React Native"
                        value={lectureName}
                        onChangeText={setLectureName}
                        editable={!isCreating}
                    />
                </View>
            </View>

            {/* Class Name Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>
                    Class Name
                </Text>
                <View style={styles.inputWrapper}>
                    <SecondaryIcon
                        name="people-outline"
                        size={20}
                        style={styles.inputIcon}
                    />
                    <PrimaryTextInput
                        style={styles.input}
                        placeholder="e.g., Computer Science 101"
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
                    isCreating && styles.createButtonDisabled,
                ]}
                onPress={onCreateLecture}
                disabled={isCreating}
                activeOpacity={0.8}
            >
                {isCreating ? (
                    <PrimarySpinner />
                ) : (
                    <>
                        <PrimaryTextIcon name="add-circle-outline" size={24} />
                        <Text style={styles.createButtonText}>Create Lecture</Text>
                    </>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};
