import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Role = "teacher" | "student" | null;

const RoleSelection = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [hoveredRole, setHoveredRole] = useState<Role>(null);

  const teacherScale = React.useRef(new Animated.Value(1)).current;
  const studentScale = React.useRef(new Animated.Value(1)).current;

  const handleRoleSelect = useCallback((role: Role) => {
    setSelectedRole(role);
  }, []);

  const handleTeacherPressIn = useCallback(() => {
    setHoveredRole("teacher");
    Animated.spring(teacherScale, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  }, [teacherScale]);

  const handleTeacherPressOut = useCallback(() => {
    setHoveredRole(null);
    Animated.spring(teacherScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [teacherScale]);

  const handleStudentPressIn = useCallback(() => {
    setHoveredRole("student");
    Animated.spring(studentScale, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  }, [studentScale]);

  const handleStudentPressOut = useCallback(() => {
    setHoveredRole(null);
    Animated.spring(studentScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [studentScale]);

  const handleConfirm = useCallback(() => {
    if (!selectedRole) return;

    // Navigate based on selected role
    if (selectedRole === "teacher") {
      router.push("/(main)/classes");
    } else {
      router.push("/(main)/attendance");
    }
  }, [selectedRole, router]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#0f0c29", "#302b63", "#24243e"]}
        style={styles.gradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>Select how you'll be using Attenex</Text>
      </View>

      {/* 3D Models Container */}
      <View style={styles.modelsContainer}>
        {/* Teacher Model */}
        <Pressable
          style={[
            styles.modelWrapper,
            selectedRole === "teacher" && styles.modelWrapperSelected,
          ]}
          onPressIn={handleTeacherPressIn}
          onPressOut={handleTeacherPressOut}
          onPress={() => handleRoleSelect("teacher")}
        >
          <Animated.View
            style={[
              styles.canvasContainer,
              { transform: [{ scale: teacherScale }] },
            ]}
          >
            <Image
              source={require("../../../../assets/images/teacher.png")}
              style={styles.roleImage}
              contentFit="contain"
            />
          </Animated.View>
          <View style={styles.labelContainer}>
            <Text style={styles.roleLabel}>Teacher</Text>
            <Text style={styles.roleDescription}>
              Manage classes & attendance
            </Text>
          </View>
          {selectedRole === "teacher" && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </Pressable>

        {/* Student Model */}
        <Pressable
          style={[
            styles.modelWrapper,
            selectedRole === "student" && styles.modelWrapperSelected,
          ]}
          onPressIn={handleStudentPressIn}
          onPressOut={handleStudentPressOut}
          onPress={() => handleRoleSelect("student")}
        >
          <Animated.View
            style={[
              styles.canvasContainer,
              { transform: [{ scale: studentScale }] },
            ]}
          >
            <Image
              source={require("../../../../assets/images/student.png")}
              style={styles.roleImage}
              contentFit="contain"
            />
          </Animated.View>
          <View style={styles.labelContainer}>
            <Text style={styles.roleLabel}>Student</Text>
            <Text style={styles.roleDescription}>Mark your attendance</Text>
          </View>
          {selectedRole === "student" && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={[
          styles.confirmButton,
          !selectedRole && styles.confirmButtonDisabled,
        ]}
        onPress={handleConfirm}
        disabled={!selectedRole}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            selectedRole ? ["#667eea", "#764ba2"] : ["#4a4a4a", "#2a2a2a"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.confirmGradient}
        >
          <Text style={styles.confirmButtonText}>
            {selectedRole ? `Continue as ${selectedRole}` : "Select a role"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0c29",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  modelsContainer: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 16,
    alignItems: "center",
  },
  modelWrapper: {
    flex: 1,
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    position: "relative",
  },
  modelWrapperSelected: {
    borderColor: "#667eea",
    borderWidth: 3,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
  },
  canvasContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  roleImage: {
    width: 250,
    height: 210,
    zIndex: -2,
  },
  imageGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  labelContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    zIndex: 2,
  },
  roleLabel: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  selectedIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmark: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  confirmButton: {
    marginHorizontal: 24,
    marginBottom: 40,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "capitalize",
  },
});

export default RoleSelection;
