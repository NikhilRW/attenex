import { useTheme } from "@/src/shared/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/CreateLecture.styles";
import { ClassItem } from "../types/common";
import { ClassSelector } from "./ClassSelector";
import { DurationSelector } from "./DurationSelector";
import { StartLectureButton } from "./StartLectureButton";
import { TopicInput } from "./TopicInput";

interface DurationOption {
    label: string;
    value: number;
}

interface CreateLectureFormCardProps {
    // Class selection
    selectedClass: string;
    existingClasses: ClassItem[];
    showClassDropdown: boolean;
    onToggleClassDropdown: () => void;
    onSelectClass: (className: string) => void;
    onAddNewClass: () => void;

    // Topic input
    lectureName: string;
    onLectureNameChange: (value: string) => void;

    // Duration selection
    duration: number;
    customDuration: string;
    showDurationDropdown: boolean;
    onToggleDurationDropdown: () => void;
    onSelectDuration: (val: number) => void;
    onChangeCustomDuration: (value: string) => void;
    durationOptions: DurationOption[];

    // Submit
    loading: boolean;
    onCreateLecture: () => void;
}

export const CreateLectureFormCard = ({
    selectedClass,
    existingClasses,
    showClassDropdown,
    onToggleClassDropdown,
    onSelectClass,
    onAddNewClass,
    lectureName,
    onLectureNameChange,
    duration,
    customDuration,
    showDurationDropdown,
    onToggleDurationDropdown,
    onSelectDuration,
    onChangeCustomDuration,
    durationOptions,
    loading,
    onCreateLecture,
}: CreateLectureFormCardProps) => {
    const { colors, isDark } = useTheme();

    return (
        <LinearGradient
            colors={
                isDark
                    ? ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]
                    : ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.5)"]
            }
            style={[styles.card, { borderColor: colors.surface.glassBorder }]}
        >
            <Text
                style={{
                    color: colors.text.secondary,
                    fontSize: 12,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 16,
                }}
            >
                Class Details
            </Text>

            <ClassSelector
                selectedClass={selectedClass}
                existingClasses={existingClasses}
                showDropdown={showClassDropdown}
                onToggleDropdown={onToggleClassDropdown}
                onSelectClass={onSelectClass}
                onAddNewClass={onAddNewClass}
            />

            <TopicInput value={lectureName} onChangeText={onLectureNameChange} />

            <View
                style={{
                    height: 1,
                    backgroundColor: colors.surface.glassBorder,
                    marginVertical: 14,
                }}
            />

            <Text
                style={{
                    color: colors.text.secondary,
                    fontSize: 12,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 16,
                }}
            >
                Time & Duration
            </Text>

            <DurationSelector
                duration={duration}
                customDuration={customDuration}
                showDropdown={showDurationDropdown}
                onToggleDropdown={onToggleDurationDropdown}
                onSelectDuration={onSelectDuration}
                onChangeCustomDuration={onChangeCustomDuration}
                options={durationOptions}
            />

            <View>
                <StartLectureButton loading={loading} onPress={onCreateLecture} />
            </View>
        </LinearGradient>
    );
};
