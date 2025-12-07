import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { authService } from "@/src/shared/services/authService";
import { useAuthStore } from "@/src/shared/stores/authStore";
import { logger } from "@/src/shared/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Role = "teacher" | "student" | null;

const RoleSelection = () => {
  const router = useRouter();
  const { colors, mode, toggleTheme } = useTheme();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [hoveredRole, setHoveredRole] = useState<Role>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const teacherScale = useSharedValue(1);
  const studentScale = useSharedValue(1);

  const handleRoleSelect = useCallback((role: Role) => {
    setSelectedRole(role);
  }, []);

  useEffect(() => {
    if (user && user.role) {
      setSelectedRole(user.role as Role);
    }
  }, []);

  const handleTeacherPress = useCallback(() => {
    if (user && user.role) {
      alreadyHasRoleToast();
      return;
    }
    setHoveredRole("teacher");
    setSelectedRole("teacher");
    teacherScale.value = withSpring(1.05, { duration: 1000 });
    studentScale.value = withSpring(1, { duration: 1000 });
  }, [teacherScale]);

  const handleStudentPress = useCallback(() => {
    if (user && user.role) {
      alreadyHasRoleToast();
      return;
    }
    setHoveredRole("student");
    setSelectedRole("student");
    teacherScale.value = withSpring(1, { duration: 1000 });
    studentScale.value = withSpring(1.05, { duration: 1000 });
  }, [studentScale]);

  const alreadyHasRoleToast = () => {
    showMessage({
      message: "Role Already Set",
      description: `You are already assigned the role of ${user!.role}.`,
      type: "info",
      duration: 2000,
      position: "bottom",
    });
  };

  const handleConfirm = useCallback(async () => {
    if (user && user.role) {
      alreadyHasRoleToast();
      return;
    }
    if (!selectedRole || isUpdating) return;

    setIsUpdating(true);

    try {
      // Call backend API to update user role
      await authService.updateUserRole(selectedRole);

      showMessage({
        message: "Role Updated",
        description: `You are now a ${selectedRole}!`,
        type: "success",
        duration: 2000,
        position: "bottom",
      });

      // Navigate based on selected role
      if (selectedRole === "teacher") {
        router.replace("/(main)/classes");
      } else {
        router.replace("/(main)/attendance");
      }
    } catch (error: any) {
      logger.error(
        "User update failed : handleConfirm() RoleSelection.tsx",
        error
      );
      showMessage({
        message: "Update Failed",
        description:
          error.message || "Failed to update role. Please try again.",
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
      setIsUpdating(false);
    }
  }, [selectedRole, router, isUpdating]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <FuturisticBackground />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Choose Your Role
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Select how you'll be using Attenex
            </Text>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons
              name={mode === "dark" ? "sunny" : "moon"}
              size={24}
              color={colors.text.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3D Models Container */}
      <View style={styles.modelsContainer}>
        {/* Teacher Model */}
        <Pressable
          style={[
            styles.modelWrapper,
            {
              backgroundColor: colors.surface.glass,
              borderColor: colors.surface.glassBorder,
            },
            selectedRole === "teacher" && {
              borderColor: colors.primary.main,
              backgroundColor: colors.primary.glow,
            },
          ]}
          onPress={handleTeacherPress}
          disabled={isUpdating}
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
          <View
            style={[
              styles.labelContainer,
              { backgroundColor: colors.surface.cardBg },
            ]}
          >
            <Text style={[styles.roleLabel, { color: colors.text.primary }]}>
              Teacher
            </Text>
            <Text
              style={[styles.roleDescription, { color: colors.text.secondary }]}
            >
              Manage classes & attendance
            </Text>
          </View>
          {selectedRole === "teacher" && (
            <View
              style={[
                styles.selectedIndicator,
                {
                  backgroundColor: colors.primary.main,
                  shadowColor: colors.primary.main,
                },
              ]}
            >
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </Pressable>

        {/* Student Model */}
        <Pressable
          style={[
            styles.modelWrapper,
            {
              backgroundColor: colors.surface.glass,
              borderColor: colors.surface.glassBorder,
            },
            selectedRole === "student" && {
              borderColor: colors.primary.main,
              backgroundColor: colors.primary.glow,
            },
          ]}
          onPress={handleStudentPress}
          disabled={isUpdating}
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
          <View
            style={[
              styles.labelContainer,
              { backgroundColor: colors.surface.cardBg },
            ]}
          >
            <Text style={[styles.roleLabel, { color: colors.text.primary }]}>
              Student
            </Text>
            <Text
              style={[styles.roleDescription, { color: colors.text.secondary }]}
            >
              Mark your attendance
            </Text>
          </View>
          {selectedRole === "student" && (
            <View
              style={[
                styles.selectedIndicator,
                {
                  backgroundColor: colors.primary.main,
                  shadowColor: colors.primary.main,
                },
              ]}
            >
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={[
          styles.confirmButton,
          {
            marginBottom: 70 + insets.bottom * 2,
          },
          (!selectedRole || isUpdating) && styles.confirmButtonDisabled,
          { shadowColor: colors.primary.main },
        ]}
        onPress={handleConfirm}
        disabled={!selectedRole || isUpdating}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            selectedRole && !isUpdating
              ? [colors.primary.main, colors.accent.blue]
              : [colors.text.muted, colors.background.tertiary]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.confirmGradient}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>
              {user && user.role
                ? `You are ${user.role}`
                : selectedRole
                  ? `Continue as ${selectedRole}`
                  : "Select a role"}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingTop: 30,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
    height: "75%",
    borderRadius: 24,
    borderWidth: 2,
    overflow: "hidden",
    position: "relative",
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
  labelContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backdropFilter: "blur(10px)",
    zIndex: 2,
  },
  roleLabel: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    textAlign: "center",
  },
  selectedIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 16,
    overflow: "hidden",
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
