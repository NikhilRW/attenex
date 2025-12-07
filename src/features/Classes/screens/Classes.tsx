import { Ionicons } from "@expo/vector-icons";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import { useTheme } from "@shared/hooks/useTheme";
import { lectureService } from "@shared/services/lectureService";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const Main = () => {
  const { colors } = useTheme();
  const [lectureName, setLectureName] = useState("");
  const [className, setClassName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateLecture = async () => {
    if (!lectureName.trim() || !className.trim()) {
      showMessage({
        message: "Validation Error",
        description: "Please fill in all fields",
        type: "danger",
        duration: 3000,
      });
      return;
    }

    setIsCreating(true);

    try {
      const response = await lectureService.createLecture({
        className: className.trim(),
        lectureName: lectureName.trim(),
      });

      if (response.success) {
        showMessage({
          message: "Success",
          description: `Lecture "${response.data?.lecture.title}" created successfully! Passcode: ${response.data?.lecture.passcode}`,
          type: "success",
          duration: 5000,
        });
        setLectureName("");
        setClassName("");
      } else {
        showMessage({
          message: "Error",
          description: response.message || "Failed to create lecture",
          type: "danger",
          duration: 3000,
        });
      }
    } catch (error: any) {
      showMessage({
        message: "Error",
        description: error.message || "An unexpected error occurred",
        type: "danger",
        duration: 3000,

      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <FuturisticBackground />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          style={styles.header}
        >
          <Ionicons
            name="school-outline"
            size={40}
            color={colors.primary.main}
          />
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Create New Lecture
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Set up a new lecture session for your class
          </Text>
        </Animated.View>

        {/* Form Card */}
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
            onPress={handleCreateLecture}
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

        {/* Info Card */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(400).springify()}
          style={[styles.infoCard, { backgroundColor: colors.surface.cardBg }]}
        >
          <Ionicons
            name="information-circle"
            size={24}
            color={colors.status.info}
          />
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            After creating a lecture, you&apos;ll be able to start it and
            generate an attendance passcode for your students.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // elevation: 5,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    height: 56,
    marginTop: 8,
    gap: 8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
