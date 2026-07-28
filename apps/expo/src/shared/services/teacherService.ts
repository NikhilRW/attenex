import { lectureService } from "@/features/Classes/services/lectureService";
import { SubjectItem } from "@shared/types/common";

export const TeacherService = {
  fetchTeacherSubjects: async () => {
    try {
      const res = await lectureService.getSubjects();
      let currentSubjects: SubjectItem[] = [];
      if (res.success) {
        currentSubjects = res.data;
      }
      return currentSubjects;
    } catch (error) {
      console.log("Error fetching subjects", error);
      throw error;
    }
  },
};
