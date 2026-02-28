import { attendanceViewStyles as styles } from "@classes/styles";
import { AttendanceHeaderProps } from "@classes/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shared/hooks";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  lectureTitle,
  searchQuery,
  setSearchQuery,
  onBack,
  onShowSummary,
}) => {
  const { colors, isDark } = useTheme();


  return (
    <LinearGradient
      colors={
        isDark
          ? [colors.background.secondary, colors.background.primary]
          : ["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.8)"]
      }
      style={[
        styles.header,
        { borderBottomColor: colors.surface.glassBorder },
      ]}
    >
      <View style={styles.headerTop}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backButton,
            {
              backgroundColor: isDark
                ? colors.surface.glass
                : "rgba(0, 0, 0, 0.05)",
            },
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.text.primary}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Attendance
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.text.secondary }]}
            numberOfLines={1}
          >
            {lectureTitle}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onShowSummary}
          style={[
            styles.summaryButton,
            {
              backgroundColor: isDark
                ? colors.surface.glass
                : "rgba(0, 0, 0, 0.05)",
            },
          ]}
        >
          <Ionicons name="list" size={20} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark
                ? colors.surface.glass
                : "rgba(0, 0, 0, 0.05)",
              borderColor: colors.surface.glassBorder,
            },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.text.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Search student..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.text.muted}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};
