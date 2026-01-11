import { User } from "@backend/middleware/auth";
import { BASE_URI } from "@shared/constants/uri";
import { io, Socket } from "socket.io-client";
class SocketService {
  private socket: Socket | null = null;

  /**
   * Initialize socket connection
   */
  connect() {
    if (this.socket?.connected) {
      return;
    }

    try {
      this.socket = io(BASE_URI, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 10000,
      });

      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket?.id);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      this.socket.on("connect_error", () => {
        // Suppress verbose socket errors in production
        console.log("Socket connection error - Backend may be offline");
      });
    } catch (_) {
      console.log("Failed to initialize socket connection");
    }
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Join a lecture room to receive updates
   */
  /**
   * Join a lecture room to receive updates
   */
  joinLecture(lectureId: string) {
    if (this.socket) {
      this.socket.emit("joinLecture", lectureId);
      console.log(`Joined lecture room: lecture-${lectureId}`);
    }
  }

  /**
   * Leave a lecture room
   */
  leaveLecture(lectureId: string, role?: User["role"]) {
    if (this.socket) {
      this.socket.emit("leaveLecture", lectureId, role);
      console.log(`Left lecture room: lecture-${lectureId}`);
    }
  }

  /**
   * Listen for lecture ended events
   */
  onLectureEnded(
    callback: (_: {
      lectureId: string;
      status: string;
      endedAt: string;
    }) => void
  ) {
    if (this.socket) {
      this.socket.on("lectureEnded", callback);
    }
  }

  /**
   * Remove lecture ended listener
   */
  offLectureEnded() {
    if (this.socket) {
      this.socket.off("lectureEnded");
    }
  }

  /**
   * Listen for passcode refresh events
   */
  onPasscodeRefresh(
    callback: (_: {
      lectureId: string;
      passcode: string;
      updatedAt: string;
    }) => void
  ) {
    if (this.socket) {
      this.socket.on("passcodeRefresh", callback);
    }
  }

  /**
   * Remove passcode refresh listener
   */
  offPasscodeRefresh() {
    if (this.socket) {
      this.socket.off("passcodeRefresh");
    }
  }

  /**
   * Listen for new student join events
   */
  onStudentJoined(
    callback: (_: {
      lectureId: string;
      studentId: string;
      studentName: string;
    }) => void
  ) {
    if (this.socket) {
      this.socket.on("studentJoined", callback);
    }
  }

  /**
   * Listen for new student leave events
   */
  onStudentLeaved(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("studentLeavedLecture", callback);
    }
  }

  /**
   * Remove student joined listener
   */
  offStudentJoined() {
    if (this.socket) {
      this.socket.off("studentJoined");
    }
  }

  /**
   * Remove student joined listener
   */
  offStudentLeaved() {
    if (this.socket) {
      this.socket.off("leaveLecture");
    }
  }

  /**
   * Listen for attendance submission events
   */
  onAttendanceSubmitted(
    callback: (_: {
      lectureId: string;
      studentId: string;
      status: string;
    }) => void
  ) {
    if (this.socket) {
      this.socket.on("attendanceSubmitted", callback);
    }
  }

  /**
   * Remove attendance submitted listener
   */
  offAttendanceSubmitted() {
    if (this.socket) {
      this.socket.off("attendanceSubmitted");
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
