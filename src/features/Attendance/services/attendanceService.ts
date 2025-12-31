import { useAuthStore } from "@shared/stores/authStore";
import http from "@shared/utils/http";

const API_URL = `/api/attendance`;

export const joinLecture = async (
  lectureId: string,
  latitude: number,
  longitude: number,
  rollNo?: string
) => {
  try {
    const token = useAuthStore.getState().token;
    const response = await http.post(
      `${API_URL}/join`,
      {
        lectureId,
        latitude,
        longitude,
        rollNo,
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

export const submitAttendance = async (
  lectureId: string,
  passcode: string,
  latitude: number,
  longitude: number
) => {
  try {
    const token = useAuthStore.getState().token;
    const response = await http.post(
      `${API_URL}/submit`,
      {
        lectureId,
        passcode,
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

export const sendPing = async (
  lectureId: string,
  latitude: number,
  longitude: number
) => {
  try {
    const token = useAuthStore.getState().token;
    // Silent ping, no error throwing usually
    await http.post(
      `${API_URL}/ping`,
      {
        lectureId,
        latitude,
        longitude,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log("Ping failed", error);
  }
};
