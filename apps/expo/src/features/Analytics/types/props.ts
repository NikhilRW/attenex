import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { GraphPoint, SelectionDotProps } from "react-native-graph";
import { SharedValue } from "react-native-reanimated";

import { DateFilterType, StudentAnalyticsLecture, StudentAnalyticsSubject } from "./common";
export interface SubjectSelectorWrapperProps {
  selectedSubjectId?: string;
  onSelectSubject: (subjectId?: string) => void;
}

export interface StudentSubjectSelectorProps {
  subjects: StudentAnalyticsSubject[];
  selectedSubjectId?: string;
  onSelectSubject: (subjectId?: string) => void;
}

export interface StudentAttendanceCardProps {
  lecture: StudentAnalyticsLecture;
}

export interface FilterChipProps {
  onFilterPress: () => void;
  filterText: string | null;
  isSelected: boolean;
}

export interface DateFiltersProps {
  selectedFilter: DateFilterType | null;
  onSelectFilter: (filter: DateFilterType) => void;
  openDateFilterSheet: () => void;
}

export interface CustomSelectionDotProps extends SelectionDotProps {
  selectedValue: SharedValue<string>;
}

export interface CustomDateFiledProps {
  date: Date | null;
  setDate: (date: Date) => void;
  defaultPlaceholder: string;
}

export interface CustomDateBottomSheetProps {
  ref: React.RefObject<TrueSheet | null>;
  customStartDate: Date | null;
  setCustomStartDate: (date: Date) => void;
  customEndDate: Date | null;
  setCustomEndDate: (date: Date) => void;
  applyDateFilter: () => void;
}

export interface AnalyticsGraphProps {
  points: GraphPoint[];
  isLoading: boolean;
}

export type AiAnalysisCardProps = {
  text?: string;
  isLoading: boolean;
};

export type AiFavButtonProps = {
  onPress: () => void;
};

export type AiMessageBubbleProps = {
  text: string;
};
