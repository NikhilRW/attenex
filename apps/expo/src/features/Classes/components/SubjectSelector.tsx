import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { UniModal } from "@/shared/components/UnistylesComponents";
import { styles } from "@classes/styles/CreateLecture.styles";
import { SubjectItem } from "@classes/types/common";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo } from "react";
import { ListRenderItemInfo, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";
// TODO: cleanup file to do only ONE THING.
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
const ITEM_HEIGHT = 56;

const SelectionModalGradient = withUnistyles(LinearGradient, (_theme, rt) => ({
  colors:
    rt.themeName === "dark"
      ? (["rgba(40, 40, 40, 0.95)", "rgba(20, 20, 20, 0.98)"] as const)
      : (["rgba(255, 255, 255, 0.95)", "rgba(245, 245, 255, 0.98)"] as const),
}));

interface SubjectSelectorProps {
  selectedSubject: string;
  existingSubjects: SubjectItem[];
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onSelectSubject: (name: string) => void;
  onAddNewSubject: () => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  selectedSubject,
  existingSubjects,
  showDropdown,
  onToggleDropdown,
  onSelectSubject,
  onAddNewSubject,
}) => {
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<SubjectItem>) => (
      <TouchableOpacity
        onPress={() => onSelectSubject(item.name)}
        style={[
          styles.optionItem,
          selectedSubject === item.name && styles.optionItemSelected,
        ]}
        haptic="selection"
        testID={`CREATE_LECTURE_SCREEN.SUBJECT_SELECTOR_ITEM_${index + 1}`}
      >
        <Text
          style={[
            styles.optionItemText,
            selectedSubject === item.name ? styles.optionItemTextSelected : null,
          ]}
        >
          {item.name}
        </Text>
        {selectedSubject === item.name && (
          <PrimaryIcon name="checkmark-circle" size={20} />
        )}
      </TouchableOpacity>
    ),
    [onSelectSubject, selectedSubject],
  );

  const keyExtractor = useCallback((item: SubjectItem) => item.id, []);

  const getItemLayout = useCallback(
    (_: ArrayLike<SubjectItem> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
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
    <View style={[styles.inputGroup, styles.inputGroupTopic]}>
      <Text style={styles.label}>Subject</Text>
      <TouchableOpacity
        haptic="selection"
        onPress={onToggleDropdown}
        testID="CREATE_LECTURE_SCREEN.SUBJECT_SELECTOR.BUTTON"
        style={styles.dropdown}
      >
        <Text
          style={[
            styles.dropdownText,
            !selectedSubject && styles.dropdownTextMuted,
          ]}
        >
          {selectedSubject || "Select a subject"}
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
          <AnimatedView
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
                  Select Subject
                </Text>
                <TouchableOpacity
                  haptic="selection"
                  onPress={onToggleDropdown}
                  style={styles.modalCloseButton}
                >
                  <SecondaryIcon name="close" size={20} />
                </TouchableOpacity>
              </View>
              <Animated.FlatList<SubjectItem>
                data={existingSubjects}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                getItemLayout={getItemLayout}
                ListEmptyComponent={
                  <View style={styles.selectionEmptyState}>
                    <MutedIcon
                      name="book-outline"
                      size={48}
                      style={styles.selectionEmptyIcon}
                    />
                    <Text style={styles.selectionEmptyText}>
                      No subjects found.{"\n"}Add one below!
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
                  onPress={onAddNewSubject}
                  style={styles.addClassCta}
                  haptic="impact"
                >
                  <PrimaryIcon name="add-circle" size={20} />
                  <Text style={styles.addClassCtaText}>Add New Subject</Text>
                </TouchableOpacity>
              </View>
            </SelectionModalGradient>
          </AnimatedView>
        </View>
      </UniModal>
    </View>
  );
};
