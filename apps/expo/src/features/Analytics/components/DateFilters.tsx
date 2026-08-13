import { FC } from "react";
import { View } from "react-native";

import FilterChip from "./FilterChip";
import { filters } from "../constants/common";
import { styles } from "../styles/DateFilterChips.styles";
import { DateFiltersProps } from "../types/props";

// TODO: think we need to refactor the filter for readability ? - []

const DateFilters: FC<DateFiltersProps> = ({
  onSelectFilter,
  selectedFilter,
  openDateFilterSheet,
}) => {
  return (
    <View style={styles.container}>
      {filters.map((filter) => (
        <FilterChip
          isSelected={filter === selectedFilter}
          key={filter}
          filterText={filter}
          onFilterPress={() => {
            if (filter === "custom") {
              openDateFilterSheet();
            }
            onSelectFilter(filter);
          }}
        />
      ))}
    </View>
  );
};

export default DateFilters;
