import { styles } from "@classes/styles/AttendanceViewScreen.styles";
import { AttendanceHeaderProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const HeaderGradient = withUnistyles(LinearGradient, (theme, rt) => ({
  colors:
    rt.themeName === "dark"
      ? ([theme.background.secondary, theme.background.primary] as const)
      : (["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.8)"] as const),
}));

const BackIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.primary,
}));

const SummaryIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const SearchIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

const ClearIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

const SearchInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.muted,
}));

export const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  lectureTitle,
  searchQuery,
  setSearchQuery,
  onBack,
  onShowSummary,
}) => {
  return (
    <HeaderGradient style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backButton, styles.headerButton]}
        >
          <BackIcon name="chevron-back" size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Attendance</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {lectureTitle}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onShowSummary}
          style={[styles.summaryButton, styles.headerButton]}
        >
          <SummaryIcon name="list" size={20} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon name="search" size={20} />
          <SearchInput
            style={styles.searchInput}
            placeholder="Search student..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <ClearIcon name="close-circle" size={18} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </HeaderGradient>
  );
};
