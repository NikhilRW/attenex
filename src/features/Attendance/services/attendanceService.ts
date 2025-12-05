import { BASE_URI } from "@/src/shared/constants/uri";
import { useAuthStore } from "@/src/shared/stores/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = `${BASE_URI}/api/attendance`;

export const joinLecture = async (
  lectureId: string,
  latitude: number,
  longitude: number,
  rollNo?: string
) => {
  try {
    const token = useAuthStore.getState().token;
    const response = await axios.post(
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
    const response = await axios.post(
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
    await axios.post(
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
