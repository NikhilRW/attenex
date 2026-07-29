import { FC } from "react";
import { Text, TouchableOpacity } from "react-native";

import Animated from "react-native-reanimated";

import { useFilterChip } from "../hooks/useFilterChip";
import { styles } from "../styles/FilterChip.styles";
import { FilterChipProps } from "../types/props";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const FilterChip: FC<FilterChipProps> = ({ filterText, onFilterPress, isSelected }) => {
  const { animatedBorderColorStyle } = useFilterChip(isSelected);
  return (
    <AnimatedTouchableOpacity
      onPress={onFilterPress}
      style={[styles.chipContainer, animatedBorderColorStyle]}
    >
      <Text style={styles.filterText}>{filterText}</Text>
    </AnimatedTouchableOpacity>
  );
};

export default FilterChip;
