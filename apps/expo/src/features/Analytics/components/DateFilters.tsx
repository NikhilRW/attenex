import { FC } from "react";
import { Text, View } from "react-native";

import FilterChip from "./FilterChip";
import { filterLabels, filters } from "../constants/common";
import { styles } from "../styles/DateFilterChips.styles";
import { DateFiltersProps } from "../types/props";

const DateFilters: FC<DateFiltersProps> = ({
  onSelectFilter,
  selectedFilter,
  openDateFilterSheet,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Date Range</Text>
      </View>
      <View style={styles.chipsContainer}>
        {filters.map((filter) => (
          <FilterChip
            isSelected={filter === selectedFilter}
            key={filter}
            filterText={filterLabels[filter]}
            onFilterPress={() => {
              if (filter === "custom") {
                openDateFilterSheet();
              }
              onSelectFilter(filter);
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default DateFilters;
