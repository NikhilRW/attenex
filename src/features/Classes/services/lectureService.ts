import http from "@shared/utils/http";

const API_URL = `/api/lectures`;

export const lectureService = {
  createLecture: async (
    lectureName: string,
    className: string,
    duration: number,
    latitude: number,
    longitude: number,
  ) => {
    try {
      const response = await http.post(`${API_URL}/create`, {
        lectureName,
        className,
        duration,
        latitude,
        longitude,
      });

      return response.data;
    } catch (error: any) {
      console.log(error);
      throw error.response?.data || error.message;
    }
  },
  endLecture: async (lectureId: string) => {
    try {
      const response = await http.put(`${API_URL}/${lectureId}/end`, {});
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getAllLectures: async () => {
    try {
      const response = await http.get(`${API_URL}/all`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getActiveLectures: async () => {
    try {
      const response = await http.get(`${API_URL}/active`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getTeacherClasses: async () => {
    try {
      const response = await http.get(`${API_URL}/classes`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  addTeacherClass: async (newClassName: string) => {
    try {
      const response = await http.post(`${API_URL}/classes`, {
        className: newClassName,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getStudentLectureDetails: async (lectureId: string) => {
    try {
      const response = await http.get(`${API_URL}/student/${lectureId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getTeacherLectureDetails: async (lectureId: string) => {
    try {
      const response = await http.get(`${API_URL}/${lectureId}/details`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  updateLecture: async (
    lectureId: string,
    updateData: {
      title?: string;
      duration?: number;
      latitude?: number;
      longitude?: number;
    },
  ) => {
    try {
      const response = await http.put(
        `${API_URL}/${lectureId}/update`,
        updateData,
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  deleteLecture: async (lectureId: string) => {
    try {
      const response = await http.delete(`${API_URL}/${lectureId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  fetchLectureAttendance: async (lectureId: string) => {
    try {
      const response = await http.get(`${API_URL}/${lectureId}/attendance`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  addManualAttendance: async (lectureId: string, studentRollNo: string) => {
    try {
      const response = await http.post(
        `${API_URL}/${lectureId}/attendance/manual`,
        {
          studentRollNo,
        },
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getStudentLectures: async (className: string) => {
    try {
      const response = await http.get(
        `${API_URL}/student/lectures?class=${encodeURI(className)}`,
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getPasscode: async (lectureId: string) => {
    try {
      const response = await http.get(`${API_URL}/${lectureId}/passcode`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getAllClasses: async () => {
    try {
      const response = await http.get(`${API_URL}/classes/all`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
