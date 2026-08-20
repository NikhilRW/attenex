import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/constants/queryKeys";
import { TeacherService } from "@/shared/services/teacherService";
import { SubjectSelector } from "@shared/components/SubjectSelector";

import { SubjectSelectorWrapperProps } from "../types/props";

export const SubjectSelectorWrapper = ({
  selectedSubject,
  onSelectSubject,
}: SubjectSelectorWrapperProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: existingSubjects = [] } = useQuery({
    queryKey: queryKeys.lectures.subjects,
    queryFn: TeacherService.fetchTeacherSubjects,
  });

  return (
    <SubjectSelector
      selectedSubject={selectedSubject}
      existingSubjects={existingSubjects}
      showDropdown={showDropdown}
      onToggleDropdown={() => setShowDropdown((prev) => !prev)}
      onSelectSubject={(name) => {
        onSelectSubject(name);
        setShowDropdown(false);
      }}
      onAddNewSubject={() => {}}
      isSubjectModificationEnabled={false}
      showLabel={true}
      isAnalyticsScreen={true}
      isAllSubjectAvailable={true}
    />
  );
};
