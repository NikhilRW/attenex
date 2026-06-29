export type CreateLectureVariables = {
  selectedSubject: string;
  selectedSubjectId: string;
  selectedClass: string;
  customDuration: string;
  duration: number;
  alert: (title: string, description: string) => void;
};
