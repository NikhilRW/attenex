import { useAuthStore } from "@shared/stores/authStore";
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
    const { token } = useAuthStore.getState();
    try {
      const response = await http.post(
        `${API_URL}/create`,
        {
          lectureName,
          className,
          duration,
          latitude,
          longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.log(error);
      throw error.response?.data || error.message;
    }
  },
  endLecture: async (lectureId: string) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await http.put(
        `${API_URL}/${lectureId}/end`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getAllLectures: async () => {
    try {
      const { token } = useAuthStore.getState();
      const response = await http.get(`${API_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getActiveLectures: async () => {
    try {
      const { token } = useAuthStore.getState();
      const response = await http.get(`${API_URL}/active`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getTeacherClasses: async () => {
    try {
      const { token } = useAuthStore.getState();
      const response = await http.get(`${API_URL}/classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  addTeacherClass: async (newClassName: string) => {
    try {
      // TODO: create modular functions for this repeitive token fetching.
      const { token } = useAuthStore.getState();
      const response = await http.post(
        `${API_URL}/classes`,
        {
          className: newClassName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getStudentLectureDetails: async (lectureId: string) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await http.get(`${API_URL}/student/${lectureId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getTeacherLectureDetails: async (lectureId: string) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await http.get(`${API_URL}/${lectureId}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const { token } = useAuthStore.getState();
      const response = await http.put(
        `${API_URL}/${lectureId}/update`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  deleteLecture: async (lectureId: string) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await http.delete(`${API_URL}/${lectureId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  fetchLectureAttendance: async (lectureId: string) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await http.get(`${API_URL}/${lectureId}/attendance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  addManualAttendance: async (lectureId: string, studentRollNo: string) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await http.post(
        `${API_URL}/${lectureId}/attendance/manual`,
        {
          studentRollNo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getStudentLectures: async (className: string) => {
    try {
      const { token } = useAuthStore.getState();
      console.log("className : " + className);
      const response = await http.get(
        `${API_URL}/student/lectures?class=${encodeURI(className)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getPasscode: async (lectureId: string) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await http.get(`${API_URL}/${lectureId}/passcode`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getAllClasses: async () => {
    const { token } = useAuthStore.getState();
    try {
      const response = await http.get(`${API_URL}/classes/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
