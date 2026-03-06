import { createLectureStyles as styles } from "@classes/styles";
import { ClassSelectorProps } from "@classes/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const AddCircleIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.secondary,
}));

const PrimaryIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const SecondaryIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.secondary,
}));

const MutedIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

const SelectionModalGradient = withUnistyles(LinearGradient, (_theme, rt) => ({
  colors:
    rt.colorScheme === "dark"
      ? (["rgba(40, 40, 40, 0.95)", "rgba(20, 20, 20, 0.98)"] as const)
      : (["rgba(255, 255, 255, 0.95)", "rgba(245, 245, 255, 0.98)"] as const),
}));

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  selectedClass,
  existingClasses,
  showDropdown,
  onToggleDropdown,
  onSelectClass,
  onAddNewClass,
}) => {
  return (
    <View style={[styles.inputGroup, styles.inputGroupClassSelector]}>
      <Text style={styles.label}>Class Name</Text>
      <TouchableOpacity onPress={onToggleDropdown} style={styles.dropdown}>
        <Text
          style={[
            styles.dropdownText,
            !selectedClass && styles.dropdownTextMuted,
          ]}
        >
          {selectedClass || "Select a class"}
        </Text>
        <AddCircleIcon name={"add-circle-sharp"} size={20} />
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={onToggleDropdown}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={onToggleDropdown}
          />
          <Animated.View
            entering={FadeInUp.springify()}
            style={styles.modalAnimatedWrapper}
          >
            <SelectionModalGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.modalContent,
                styles.modalSurface,
                styles.modalSurfaceFlat,
              ]}
            >
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalTitle, styles.modalTitleInline]}>
                  Select Class
                </Text>
                <TouchableOpacity
                  onPress={onToggleDropdown}
                  style={styles.modalCloseButton}
                >
                  <SecondaryIcon name="close" size={20} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.dropdownScroll}
                nestedScrollEnabled
                showsVerticalScrollIndicator={true}
              >
                {existingClasses.length === 0 ? (
                  <View style={styles.selectionEmptyState}>
                    <MutedIcon
                      name="school-outline"
                      size={48}
                      style={styles.selectionEmptyIcon}
                    />
                    <Text style={styles.selectionEmptyText}>
                      No classes found.{"\n"}Add one below!
                    </Text>
                  </View>
                ) : (
                  existingClasses.map((cls) => (
                    <TouchableOpacity
                      key={cls.id}
                      onPress={() => onSelectClass(cls.name)}
                      style={[
                        styles.optionItem,
                        selectedClass === cls.name && styles.optionItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionItemText,
                          selectedClass === cls.name
                            ? styles.optionItemTextSelected
                            : null,
                        ]}
                      >
                        {cls.name}
                      </Text>
                      {selectedClass === cls.name && (
                        <PrimaryIcon name="checkmark-circle" size={20} />
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>

              <View style={styles.selectionFooter}>
                <TouchableOpacity
                  onPress={onAddNewClass}
                  style={styles.addClassCta}
                >
                  <PrimaryIcon name="add-circle" size={20} />
                  <Text style={styles.addClassCtaText}>Add New Class</Text>
                </TouchableOpacity>
              </View>
            </SelectionModalGradient>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};
