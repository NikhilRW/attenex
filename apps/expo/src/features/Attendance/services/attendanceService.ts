import http from "@shared/utils/http";

const API_URL = `/api/attendance`;

export const joinLecture = async (
  lectureId: string,
  latitude: number,
  longitude: number,
  rollNo?: string,
) => {
  try {
    const response = await http.post(`${API_URL}/join`, {
      lectureId,
      latitude,
      longitude,
      rollNo,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const submitAttendance = async (
  lectureId: string,
  passcode: string,
  latitude: number,
  longitude: number,
) => {
  try {
    const response = await http.post(`${API_URL}/submit`, {
      lectureId,
      passcode,
      latitude,
      longitude,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const sendPing = async (
  lectureId: string,
  latitude: number,
  longitude: number,
) => {
  try {
    // Silent ping, no error throwing usually
    await http.post(`${API_URL}/ping`, {
      lectureId,
      latitude,
      longitude,
    });
  } catch (error) {
    console.log("Ping failed", error);
  }
};
