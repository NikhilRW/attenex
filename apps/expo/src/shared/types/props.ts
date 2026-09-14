import { SubjectItem } from "./common";

export interface TabBarButtonProps {
  name: string;
  isActivated: boolean;
  onPress: (routeName: string) => void;
  onPrefetch?: (routeName: string) => void;
  testID?: string;
}

export interface SubjectSelectorProps {
  selectedSubject: string;
  selectedSubjectId?: string;
  existingSubjects: SubjectItem[];
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onSelectSubject: (name: string, id?: string) => void;
  onAddNewSubject: () => void;
  isSubjectModificationEnabled?: boolean;
  showLabel?: boolean;
  isAllSubjectAvailable?: boolean;
}
