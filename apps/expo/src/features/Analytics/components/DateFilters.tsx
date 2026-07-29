import { FC } from "react";
import { View } from "react-native";

import FilterChip from "./FilterChip";
import { filters } from "../constants/common";
import { styles } from "../styles/DateFilterChips.styles";
import { DateFiltersProps } from "../types/props";

const DateFilters: FC<DateFiltersProps> = ({ onSelectFilter, selectedFilter }) => {
  return (
    <View style={styles.container}>
      {filters.map((filter, index) => (
        <FilterChip
          isSelected={filter === selectedFilter}
          key={index}
          filterText={filter}
          onFilterPress={() => onSelectFilter(filter)}
        />
      ))}
    </View>
  );
};

export default DateFilters;
