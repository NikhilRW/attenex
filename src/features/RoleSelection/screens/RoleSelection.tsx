import {
  ConfirmButton,
  RoleCard,
  RoleSelectionHeader,
} from "@role-selection/components";
import { STUDENT_IMG, TEACHER_IMG } from "@role-selection/constants";
import { useRoleSelection } from "@role-selection/hooks";
import { styles } from "@role-selection/styles";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UnistylesRuntime } from "react-native-unistyles";

const RoleSelection = () => {
  const isDark = UnistylesRuntime.themeName === "dark";
  const insets = useSafeAreaInsets();
  const {
    selectedRole,
    isUpdating,
    user,
    teacherScale,
    studentScale,
    handleTeacherPress,
    handleStudentPress,
    handleRoleUpdate,
  } = useRoleSelection();

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <FuturisticBackground />

      <RoleSelectionHeader />

      <View style={styles.modelsContainer}>
        <RoleCard
          role="teacher"
          imageSource={TEACHER_IMG}
          title="Teacher"
          description="Manage classes & attendance"
          isSelected={selectedRole === "teacher"}
          isDisabled={isUpdating}
          scale={teacherScale}
          onPress={handleTeacherPress}
        />

        <RoleCard
          role="student"
          imageSource={STUDENT_IMG}
          title="Student"
          description="Mark your attendance"
          isSelected={selectedRole === "student"}
          isDisabled={isUpdating}
          scale={studentScale}
          onPress={handleStudentPress}
        />
      </View>

      <ConfirmButton
        selectedRole={selectedRole}
        isUpdating={isUpdating}
        userRole={user?.role}
        bottomInset={insets.bottom}
        onConfirm={handleRoleUpdate}
      />
    </View>
  );
};

export default RoleSelection;
