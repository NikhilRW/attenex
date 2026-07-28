import { TEACHER_QUERY_FRESH_MS } from "../constants/common";
import { styles } from "../styles/AttendanceViewScreen.styles";
import { FilterType, LectureApiItem, LectureWithCount } from "../types/common";

export const getMinHeightForScrollView = (windowHeight: number) => {
  return windowHeight + 40;
};

export const getIsFreshQuery = (dataUpdatedAt: number | undefined) =>
  dataUpdatedAt != null && Date.now() - dataUpdatedAt < TEACHER_QUERY_FRESH_MS;

export const mapLectureWithCount = (lecture: LectureApiItem): LectureWithCount => ({
  ...lecture,
  subject: lecture.subject ?? "",
  createdAt: lecture.createdAt ?? "",
  courseName: lecture.className ?? "",
  studentCount: Number(lecture.studentCount ?? 0),
  absentCount: Number(lecture.absentCount ?? 0),
  totalClassStudents: Number(lecture.totalClassStudents ?? 0),
});

export const getFilterButtonStyle = (filter: FilterType) => {
  switch (filter) {
    case "present":
      return styles.filterButtonPresent;
    case "incomplete":
      return styles.filterButtonIncomplete;
    case "absent":
      return styles.filterButtonAbsent;
    default:
      return styles.filterButtonAll;
  }
};
