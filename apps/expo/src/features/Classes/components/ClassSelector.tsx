import React, { useCallback, useMemo } from "react";
import { ListRenderItemInfo, Text, View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { UniModal } from "@/shared/components/UnistylesComponents";
import { styles } from "@classes/styles/CreateLecture.styles";
import { ClassItem } from "@classes/types/common";
import { ClassSelectorProps } from "@classes/types/props";

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

const AnimatedView = withUnistyles(Animated.View);
const CLASS_ITEM_HEIGHT = 56;

const SelectionModalGradient = withUnistyles(LinearGradient, (_theme, rt) => ({
  colors:
    rt.themeName === "dark"
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
  const renderClassItem = useCallback(
    ({ item: cls, index }: ListRenderItemInfo<ClassItem>) => (
      <TouchableOpacity
        onPress={() => onSelectClass(cls.name)}
        style={[styles.optionItem, selectedClass === cls.name && styles.optionItemSelected]}
        haptic="selection"
        testID={`CREATE_LECTURE_SCREEN.CLASS_SELECTOR_ITEM_${index + 1}`}
      >
        <Text
          style={[
            styles.optionItemText,
            selectedClass === cls.name ? styles.optionItemTextSelected : null,
          ]}
        >
          {cls.name}
        </Text>
        {selectedClass === cls.name ? <PrimaryIcon name="checkmark-circle" size={20} /> : null}
      </TouchableOpacity>
    ),
    [onSelectClass, selectedClass],
  );

  const keyExtractor = useCallback((item: ClassItem) => item.id, []);

  const getItemLayout = useCallback(
    (_: ArrayLike<ClassItem> | null | undefined, index: number) => ({
      length: CLASS_ITEM_HEIGHT,
      offset: CLASS_ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const flatListPerformanceProps = useMemo(
    () => ({
      removeClippedSubviews: true,
      initialNumToRender: 10,
      maxToRenderPerBatch: 10,
      updateCellsBatchingPeriod: 40,
      windowSize: 8,
    }),
    [],
  );

  return (
    <View style={[styles.inputGroup, styles.inputGroupClassSelector]}>
      <Text style={styles.label}>Class Name</Text>
      <TouchableOpacity
        haptic="selection"
        onPress={onToggleDropdown}
        testID="CREATE_LECTURE_SCREEN.CLASS_SELECTOR.BUTTON"
        style={styles.dropdown}
      >
        <Text style={[styles.dropdownText, !selectedClass && styles.dropdownTextMuted]}>
          {selectedClass || "Select a class"}
        </Text>
        <AddCircleIcon name="add-circle-sharp" size={20} />
      </TouchableOpacity>

      <UniModal
        visible={showDropdown}
        presentationStyle="fullScreen"
        animationType="fade"
        onRequestClose={onToggleDropdown}
      >
        <View style={styles.modalContainer}>
          <AnimatedView entering={FadeInUp.springify()} style={styles.modalAnimatedWrapper}>
            <SelectionModalGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.modalContent, styles.modalSurface, styles.modalSurfaceFlat]}
            >
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalTitle, styles.modalTitleInline]}>Select Class</Text>
                <TouchableOpacity
                  haptic="selection"
                  onPress={onToggleDropdown}
                  style={styles.modalCloseButton}
                >
                  <SecondaryIcon name="close" size={20} />
                </TouchableOpacity>
              </View>
              <Animated.FlatList<ClassItem>
                data={existingClasses}
                keyExtractor={keyExtractor}
                renderItem={renderClassItem}
                getItemLayout={getItemLayout}
                ListEmptyComponent={
                  <View style={styles.selectionEmptyState}>
                    <MutedIcon name="school-outline" size={48} style={styles.selectionEmptyIcon} />
                    <Text style={styles.selectionEmptyText}>
                      No classes found.{"\n"}Add one below!
                    </Text>
                  </View>
                }
                style={styles.dropdownScroll}
                nestedScrollEnabled
                showsVerticalScrollIndicator={true}
                {...flatListPerformanceProps}
              />

              <View style={styles.selectionFooter}>
                <TouchableOpacity
                  onPress={onAddNewClass}
                  style={styles.addClassCta}
                  haptic="impact"
                >
                  <PrimaryIcon name="add-circle" size={20} />
                  <Text style={styles.addClassCtaText}>Add New Class</Text>
                </TouchableOpacity>
              </View>
            </SelectionModalGradient>
          </AnimatedView>
        </View>
      </UniModal>
    </View>
  );
};
