import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/constants/queryKeys";
import { TeacherService } from "@/shared/services/teacherService";
import { SubjectSelector } from "@shared/components/SubjectSelector";

import { ALL_SUBJECTS_ID } from "../constants/common";
import { styles as dateFilterStyles } from "../styles/DateFilterChips.styles";
import { SubjectSelectorWrapperProps } from "../types/props";
import { getSelectedSubjectLabel, getSubjectOptionsWithAll } from "../utils/common";

export const SubjectSelectorWrapper = ({
  selectedSubjectId,
  onSelectSubject,
}: SubjectSelectorWrapperProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: existingSubjects } = useQuery({
    queryKey: queryKeys.lectures.subjects,
    queryFn: TeacherService.fetchTeacherSubjects,
  });
  const options = useMemo(
    () => getSubjectOptionsWithAll(existingSubjects ?? []),
    [existingSubjects],
  );
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
        onToggleDropdown={() => setShowDropdown((prev) => !prev)}
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
