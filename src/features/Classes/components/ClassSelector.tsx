import { createLectureStyles as styles } from "@classes/styles";
import { ClassSelectorProps } from "@classes/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shared/hooks";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  selectedClass,
  existingClasses,
  showDropdown,
  onToggleDropdown,
  onSelectClass,
  onAddNewClass,
}) => {
  const { colors, isDark } = useTheme();


  return (
    <View style={[styles.inputGroup, { zIndex: 20 }]}>
      <Text style={[styles.label, { color: colors.text.secondary }]}>
        Class Name
      </Text>
      <TouchableOpacity
        onPress={onToggleDropdown}
        style={[
          styles.dropdown,
          {
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.2)"
              : "rgba(255, 255, 255, 0.5)",
            borderColor: colors.surface.glassBorder,
          },
        ]}
      >
        <Text
          style={[
            styles.dropdownText,
            {
              color: selectedClass ? colors.text.primary : colors.text.muted,
            },
          ]}
        >
          {selectedClass || "Select a class"}
        </Text>
        <Ionicons
          name={"add-circle-sharp"}
          size={20}
          color={colors.text.secondary}
        />
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={onToggleDropdown}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ width: "100%", height: "100%", position: "absolute" }}
            onPress={onToggleDropdown}
          />
          <Animated.View
            entering={FadeInUp.springify()}
            style={{ width: "100%", maxWidth: 400 }}
          >
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(40, 40, 40, 0.95)", "rgba(20, 20, 20, 0.98)"]
                  : ["rgba(255, 255, 255, 0.95)", "rgba(245, 245, 255, 0.98)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.modalContent,
                {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.8)",
                  borderWidth: 1,
                  padding: 0,
                  overflow: "hidden",
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: colors.text.primary,
                  }}
                >
                  Select Class
                </Text>
                <TouchableOpacity
                  onPress={onToggleDropdown}
                  style={{
                    padding: 8,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                    borderRadius: 20,
                  }}
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={{
                  maxHeight: 280,
                  ...(existingClasses.length === 0 && { minHeight: 120 }),
                }}
                nestedScrollEnabled
                showsVerticalScrollIndicator={true}
              >
                {existingClasses.length === 0 ? (
                  <View style={{ padding: 40, alignItems: "center", justifyContent: "center", flex: 1 }}>
                    <Ionicons name="school-outline" size={48} color={colors.text.muted} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <Text style={{ color: colors.text.muted, fontSize: 16, textAlign: "center" }}>
                      No classes found.{"\n"}Add one below!
                    </Text>
                  </View>
                ) : (
                  existingClasses.map((cls) => (
                    <TouchableOpacity
                      key={cls.id}
                      onPress={() => onSelectClass(cls.name)}
                      style={{
                        padding: 16,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottomWidth: 1,
                        borderBottomColor: isDark
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(0,0,0,0.02)",
                        backgroundColor:
                          selectedClass === cls.name
                            ? isDark
                              ? "rgba(8, 145, 178, 0.1)"
                              : "rgba(8, 145, 178, 0.05)"
                            : "transparent",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color:
                            selectedClass === cls.name
                              ? colors.primary.main
                              : colors.text.primary,
                          fontWeight: selectedClass === cls.name ? "600" : "500",
                        }}
                      >
                        {cls.name}
                      </Text>
                      {selectedClass === cls.name && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={colors.primary.main}
                        />
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>

              <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: colors.surface.glassBorder }}>
                <TouchableOpacity
                  onPress={onAddNewClass}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 16,
                    backgroundColor: isDark
                      ? "rgba(59, 130, 246, 0.1)"
                      : "rgba(59, 130, 246, 0.05)",
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: colors.primary.glow,
                    gap: 8,
                  }}
                >
                  <Ionicons
                    name="add-circle"
                    size={20}
                    color={colors.primary.main}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: colors.primary.main,
                    }}
                  >
                    Add New Class
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};
