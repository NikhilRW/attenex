export interface SubjectSelectorWrapperProps {
  selectedSubject: string;
  onSelectSubject: (name: string) => void;
}

export interface FilterChipProps {
  onFilterPress: () => void;
  filterText: string | null;
  isSelected: boolean;
}

export interface DateFiltersProps {
  selectedFilter: string | null;
  onSelectFilter: (filter: string) => void;
}
