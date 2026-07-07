import { ConfirmButton } from "@role-selection/components/ConfirmButton";
import { RoleCard } from "@role-selection/components/RoleCard";
import { RoleSelectionHeader } from "@role-selection/components/RoleSelectionHeader";
import { STUDENT_IMG, TEACHER_IMG } from "@role-selection/constants/common";
import { useRoleSelection } from "@role-selection/hooks/useRoleSelection";
import { styles } from "@role-selection/styles/RoleSelection.styles";
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
