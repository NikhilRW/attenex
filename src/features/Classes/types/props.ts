import { SkPath } from "@shopify/react-native-skia";
import { StyleProp, ViewStyle } from "react-native";
import { AnimatedStyle, SharedValue } from "react-native-reanimated";
import {
  AttendanceRecord,
  ClassItem,
  FilterType,
  LectureWithCount,
} from "./common";
import { CreateLectureVariables } from "./params";

/**
 * AttendanceFilter component props
 */
export interface AttendanceFilterProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

/**
 * AttendanceFloatingButton component props
 */
export interface AttendanceFloatingButtonProps {
  onPress: () => void;
}

/**
 * AttendanceHeader component props
 */
export interface AttendanceHeaderProps {
  lectureTitle: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onBack: () => void;
  onShowSummary: () => void;
}

/**
 * ClassSelector component props
 */
export interface ClassSelectorProps {
  selectedClass: string;
  existingClasses: ClassItem[];
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onSelectClass: (className: string) => void;
  onAddNewClass: () => void;
}

/**
 * CreateLectureForm component props
 */
export interface CreateLectureFormProps {
  lectureName: string;
  setLectureName: (value: string) => void;
  className: string;
  setClassName: (value: string) => void;
  isCreating: boolean;
  onCreateLecture: () => void;
}

/**
 * DurationOption interface for duration selectors
 */
export interface DurationOption {
  label: string;
  value: number;
}

/**
 * CreateLectureFormCard component props
 */
export interface CreateLectureFormCardProps {
  // Class selection
  selectedClass: string;
  existingClasses: ClassItem[];
  showClassDropdown: boolean;
  onToggleClassDropdown: () => void;
  onSelectClass: (className: string) => void;
  onAddNewClass: () => void;

  // Topic input
  lectureName: string;
  onLectureNameChange: (value: string) => void;

  // Duration selection
  duration: number;
  customDuration: string;
  showDurationDropdown: boolean;
  onToggleDurationDropdown: () => void;
  onSelectDuration: (val: number) => void;
  onChangeCustomDuration: (value: string) => void;
  durationOptions: DurationOption[];

  // Submit
  loading: boolean;
  onCreateLecture: (variables: CreateLectureVariables) => void;
}

/**
 * CreateLectureHeader component props
 */
export interface CreateLectureHeaderProps {
  onBack: () => void;
}

/**
 * DurationSelector component props
 */
export interface DurationSelectorProps {
  duration: number;
  customDuration: string;
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onSelectDuration: (duration: number) => void;
  onChangeCustomDuration: (text: string) => void;
  options: DurationOption[];
}

/**
 * HeaderSection component props
 */
export interface HeaderSectionProps {
  navigateToCreate: () => void;
  totalActive: number;
  totalStudents: number;
  lectures: LectureWithCount[];
}

/**
 * LectureCard component props
 */
export interface LectureCardProps {
  lecture: LectureWithCount;
  index: number;
  handleViewAttendance: (lecture: LectureWithCount) => void;
  handleEditLecture: (lecture: LectureWithCount) => void;
  handleEndLecture: (lectureId: string, lectureTitle: string) => void;
  handleDeleteLecture: (lecture: LectureWithCount) => void;
  isLectureCreating: boolean;
}

/**
 * LectureEditModal component props
 */
export interface LectureEditModalProps {
  editModalVisible: boolean;
  setEditModalVisible: (visible: boolean) => void;
  editTitle: string;
  setEditTitle: (title: string) => void;
  editDuration: string;
  setEditDuration: (duration: string) => void;
  handleUpdateLecture: () => void;
}

/**
 * LectureEndedDoneButton component props
 */
export interface LectureEndedDoneButtonProps {
  onDone: () => void;
}

/**
 * LectureEndedHeader component props
 */
export interface LectureEndedHeaderProps {
  onDone: () => void;
}

/**
 * LectureEndedTitle component props
 */
export interface LectureEndedTitleProps {
  lectureTitle: string | string[];
}

/**
 * ManualAttendanceModal component props
 */
export interface ManualAttendanceModalProps {
  visible: boolean;
  onClose: () => void;
  manualRollNo: string;
  setManualRollNo: (text: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

/**
 * NewClassModal component props
 */
export interface NewClassModalProps {
  visible: boolean;
  onClose: () => void;
  newClassName: string;
  setNewClassName: (text: string) => void;
  onCreateClass: (className: string) => Promise<{ success: boolean }>;
}

/**
 * PasscodeCard component props
 */
export interface PasscodeCardProps {
  passcode: string | null;
  loading: boolean;
  onRefresh: () => void;
}

/**
 * PullIndicator component props
 */
export interface PullIndicatorProps {
  pullIndicatorStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  pullProgress: SharedValue<number>;
  circlePath: SkPath;
}

/**
 * RollSummaryModal component props
 */
export interface RollSummaryModalProps {
  visible: boolean;
  onClose: () => void;
  presentRollNumbers: string;
  presentCount: number;
  incompleteCount: number;
  absentCount: number;
  onCopy: () => void;
}

/**
 * StartLectureButton component props
 */
export interface StartLectureButtonProps {
  loading: boolean;
  onPress: () => void;
}

/**
 * StatisticsCard component props
 */
export interface StatisticsCardProps {
  totalActive: number;
  totalStudents: number;
  lectures: LectureWithCount[];
}

/**
 * StudentCard component props
 */
export interface StudentCardProps {
  record: AttendanceRecord;
  index: number;
}

/**
 * TopicInput component props
 */
export interface TopicInputProps {
  value: string;
  onChangeText: (text: string) => void;
}
