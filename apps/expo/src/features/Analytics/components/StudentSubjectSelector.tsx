import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { SubjectSelector } from "@shared/components/SubjectSelector";

import { ALL_SUBJECTS_ID } from "../constants/common";
import { styles as dateFilterStyles } from "../styles/DateFilterChips.styles";
import { StudentSubjectSelectorProps } from "../types/props";
import { getSelectedSubjectLabel, getStudentSubjectOptions } from "../utils/common";

export const StudentSubjectSelector = ({
  subjects,
  selectedSubjectId,
  onSelectSubject,
}: StudentSubjectSelectorProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const options = useMemo(() => getStudentSubjectOptions(subjects), [subjects]);
  const selectedSubject = useMemo(
    () => getSelectedSubjectLabel(options, selectedSubjectId),
    [options, selectedSubjectId],
  );

  return (
    <View>
      <View style={dateFilterStyles.subjectLabelRow}>
        <Text style={dateFilterStyles.label}>Subject</Text>
      </View>
      <SubjectSelector
        selectedSubject={selectedSubject}
        selectedSubjectId={selectedSubjectId ?? ALL_SUBJECTS_ID}
        existingSubjects={options}
        showDropdown={showDropdown}
        onToggleDropdown={() => setShowDropdown((visible) => !visible)}
        onSelectSubject={(_name, id) => {
          onSelectSubject(id === ALL_SUBJECTS_ID ? undefined : id);
          setShowDropdown(false);
        }}
        onAddNewSubject={() => {}}
        isSubjectModificationEnabled={false}
        showLabel={false}
      />
    </View>
  );
};
