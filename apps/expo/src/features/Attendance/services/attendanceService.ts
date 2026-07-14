import * as v from "valibot";

import {
  joinLectureSuccessResponseSchema,
  pingLectureSuccessResponseSchema,
  submitAttendanceSuccessResponseSchema,
} from "@attenex/api-contracts";
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
    const parsed = v.safeParse(joinLectureSuccessResponseSchema, response.data);
    if (!parsed.success) {
      throw new Error("Invalid join lecture response");
    }
    return parsed.output;
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
    const parsed = v.safeParse(submitAttendanceSuccessResponseSchema, response.data);
    if (!parsed.success) {
      throw new Error("Invalid submit attendance response");
    }
    return parsed.output;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const sendPing = async (lectureId: string, latitude: number, longitude: number) => {
  try {
    const response = await http.post(`${API_URL}/ping`, {
      lectureId,
      latitude,
      longitude,
    });
    const parsed = v.safeParse(pingLectureSuccessResponseSchema, response.data);
    if (!parsed.success) {
      console.log("Invalid ping response", parsed.issues);
    }
  } catch (error) {
    console.log("Ping failed", error);
  }
};
