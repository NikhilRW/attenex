import { BASE_URI } from "@/src/shared/constants/uri";
import { useAuthStore } from "@/src/shared/stores/authStore";
import axios from "axios";

const API_URL = `${BASE_URI}/api/lectures`;

export const createLecture = async (
  lectureName: string,
  className: string,
  duration: number,
  latitude: number,
  longitude: number
) => {
  const { token } = useAuthStore.getState();
  try {
    const response = await axios.post(
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
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const endLecture = async (lectureId: string) => {
  try {
    const { token } = useAuthStore.getState();
    const response = await axios.put(
      `${API_URL}/${lectureId}/end`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getAllLectures = async () => {
  try {
    const { token } = useAuthStore.getState();
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getActiveLectures = async () => {
  try {
    const { token } = useAuthStore.getState();
    const response = await axios.get(`${API_URL}/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getTeacherClasses = async () => {
  try {
    const { token } = useAuthStore.getState();
    const response = await axios.get(`${API_URL}/classes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getLectureDetails = async (lectureId: string) => {
  try {
    const { token } = useAuthStore.getState();
    const response = await axios.get(`${API_URL}/${lectureId}/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updateLecture = async (
  lectureId: string,
  updateData: {
    title?: string;
    duration?: number;
    latitude?: number;
    longitude?: number;
  }
) => {
  try {
    const { token } = useAuthStore.getState();
    const response = await axios.put(
      `${API_URL}/${lectureId}/update`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deleteLecture = async (lectureId: string) => {
  try {
    const { token } = useAuthStore.getState();
    const response = await axios.delete(`${API_URL}/${lectureId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const fetchLectureAttendance = async (lectureId: string) => {
  try {
    const { token } = useAuthStore.getState();
    const response = await axios.get(`${API_URL}/${lectureId}/attendance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const addManualAttendance = async (
  lectureId: string,
  studentEmail: string
) => {
  try {
    const { token } = useAuthStore.getState();
    const response = await axios.post(
      `${API_URL}/${lectureId}/attendance/manual`,
      {
        studentEmail,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getStudentLectures = async (className: string) => {
  try {
    const { token } = useAuthStore.getState();
    console.log("className : "+className);
    const response = await axios.get(
      `${API_URL}/student/lectures?class=${encodeURI(className)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getPasscode = async (lectureId: string) => {
  try {
    const { token } = useAuthStore.getState();
    const response = await axios.get(`${API_URL}/${lectureId}/passcode`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getAllClasses = async () => {
  const { token } = useAuthStore.getState();
  try {
    const response = await axios.get(`${API_URL}/classes/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
