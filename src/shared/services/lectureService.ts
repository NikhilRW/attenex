import { BASE_URI } from "../constants/uri";
import { useAuthStore } from "../stores/authStore";

export interface CreateLectureRequest {
  className: string;
  lectureName: string;
}

export interface CreateLectureResponse {
  success: boolean;
  message: string;
  data?: {
    lecture: {
      id: string;
      title: string;
      className: string;
      passcode: string;
      status: string;
      createdAt: Date;
    };
  };
  error?: string;
}

class LectureService {
  /**
   * Create a new lecture
   */
  async createLecture(
    request: CreateLectureRequest
  ): Promise<CreateLectureResponse> {
    try {
      const token = useAuthStore.getState().token;

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${BASE_URI}/api/lectures/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create lecture");
      }

      return data;
    } catch (error: any) {
      console.error("Create lecture error:", error);
      return {
        success: false,
        message: error.message || "Failed to create lecture",
      };
    }
  }
}

export const lectureService = new LectureService();
