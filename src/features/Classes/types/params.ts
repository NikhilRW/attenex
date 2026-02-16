export type CreateLectureVariables = {
  lectureName: string;
  selectedClass: string;
  customDuration: string;
  duration: number;
  alert: (title: string, description: string) => void;
};
