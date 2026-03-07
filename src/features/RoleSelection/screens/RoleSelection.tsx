import {
  ConfirmButton,
  RoleCard,
  RoleSelectionHeader,
} from "@role-selection/components";
import { STUDENT_IMG, TEACHER_IMG } from "@role-selection/constants";
import { useRoleSelection } from "@role-selection/hooks";
import { styles } from "@role-selection/styles";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RoleSelection = () => {
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
