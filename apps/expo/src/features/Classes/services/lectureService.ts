import http from "@shared/utils/http";
import * as v from "valibot";
import {
  createLectureResponseSchema,
  addTeacherClassSuccessResponseSchema,
  addTeacherSubjectSuccessResponseSchema,
  deleteLectureSuccessResponseSchema,
  addManualAttendanceSuccessResponseSchema,
  endLectureSuccessResponseSchema,
  getAllLecturesSuccessResponseSchema,
  fetchLectureAttendanceSuccessResponseSchema,
} from "@attenex/api-contracts";

const API_URL = `/api/lectures`;

export const lectureService = {
  createLecture: async (
    subjectId: string,
    className: string,
    duration: number,
    latitude: number,
    longitude: number,
  ) => {
    try {
      const response = await http.post(`${API_URL}/create`, {
        subjectId,
        className,
        duration,
        latitude,
        longitude,
      });

      const parsed = v.safeParse(createLectureResponseSchema, response.data);
      if (!parsed.success) {
        throw new Error("Invalid create lecture response");
      }

      return parsed.output;
    } catch (error: any) {
      console.log(error);
      throw error.response?.data || error.message;
    }
  },
  endLecture: async (lectureId: string) => {
    try {
      const response = await http.put(`${API_URL}/${lectureId}/end`, {});
      const parsed = v.safeParse(endLectureSuccessResponseSchema, response.data);
      if (!parsed.success) {
        throw new Error("Invalid end lecture response");
      }
      return parsed.output;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getAllLectures: async () => {
    try {
      const response = await http.get(`${API_URL}/all`);
      const parsed = v.safeParse(getAllLecturesSuccessResponseSchema, response.data);
      if (!parsed.success) {
        throw new Error("Invalid get all lectures response");
      }
      return parsed.output;
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
      const parsed = v.safeParse(
        addTeacherClassSuccessResponseSchema,
        response.data,
      );
      if (!parsed.success) {
        throw new Error("Invalid add class response");
      }
      return parsed.output;
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
  updateLecture: async (
    lectureId: string,
    updateData: {
      subjectId?: string | null;
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
      const parsed = v.safeParse(
        deleteLectureSuccessResponseSchema,
        response.data,
      );
      if (!parsed.success) {
        throw new Error("Invalid delete lecture response");
      }
      return parsed.output;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  fetchLectureAttendance: async (lectureId: string) => {
    try {
      const response = await http.get(`${API_URL}/${lectureId}/attendance`);
      const parsed = v.safeParse(fetchLectureAttendanceSuccessResponseSchema, response.data);
      if (!parsed.success) {
        throw new Error("Invalid fetch lecture attendance response");
      }
      return parsed.output;
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
      const parsed = v.safeParse(
        addManualAttendanceSuccessResponseSchema,
        response.data,
      );
      if (!parsed.success) {
        throw new Error("Invalid manual attendance response");
      }
      return parsed.output;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getSubjects: async () => {
    try {
      const response = await http.get(`${API_URL}/subjects`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  createSubject: async (name: string) => {
    try {
      const response = await http.post(`${API_URL}/subjects`, { name });
      const parsed = v.safeParse(
        addTeacherSubjectSuccessResponseSchema,
        response.data,
      );
      if (!parsed.success) {
        throw new Error("Invalid create subject response");
      }
      return parsed.output;
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
};
