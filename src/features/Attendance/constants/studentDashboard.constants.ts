/**
 * Constants for StudentDashboard component
 */

// Timing constants
export const LECTURE_AUTO_REFRESH_INTERVAL = 30000; // 30 Seconds
export const ALERT_DELAY = 100; // Delay before showing alerts

// Validation constants
export const PASSCODE_LENGTH = 4;

// Location accuracy
export const LOCATION_ACCURACY = {
  HIGHEST: "highest" as const,
  HIGH: "high" as const,
};

// Alert messages
export const ALERT_MESSAGES = {
  PERMISSION_DENIED: {
    title: "Permission denied",
    message: "Location is required to join class.",
  },
  JOINED: {
    title: "Joined!",
    message:
      "Location tracking started. Wait for class to end, then verify attendance.",
  },
  JOIN_FAILED: {
    title: "Join Failed",
    message: "Could not join class",
  },
  INVALID_PASSCODE: {
    title: "Invalid Passcode",
    message: "Please enter the 4-digit passcode.",
  },
  ATTENDANCE_SUCCESS: {
    title: "Success",
    message: "Attendance Marked Present! ✅",
  },
  SUBMISSION_FAILED: {
    title: "Submission Failed",
    message: "Could not mark attendance",
  },
  LEAVE_LECTURE: {
    title: "Leave Lecture",
    message:
      "Are you sure you want to leave this lecture? Your attendance will not be recorded.",
  },
  LECTURE_ENDED: {
    title: "Lecture Ended",
    message:
      "The teacher has ended the lecture. Please verify your attendance now with the passcode.",
  },
  CLASS_REQUIRED: {
    title: "Error",
    message: "Please enter a class name",
  },
  CLASS_UPDATE_SUCCESS: {
    title: "Success",
    message: "Class updated successfully!",
  },
  CLASS_UPDATE_FAILED: {
    title: "Error",
    message: "Failed to update class",
  },
  ROLLNO_REQUIRED: {
    title: "Error",
    message: "Please enter your roll number",
  },
  LECTURE_DETAILS_FAILED: {
    title: "Error",
    message: "Could not load lecture details. Please try again.",
  },
  ROLL_NO_NOT_UPDATED: {
    title: "Roll no not updated successfully",
    message: "Kindly try again",
  },
};

// Log messages
export const LOG_MESSAGES = {
  STUDENT_DASHBOARD_PREFIX: "Student Dashboard : ",
  FETCHING_LECTURES: "🔍 Fetching lectures for user:",
  NO_CLASSNAME: "⚠️ No className set for user",
  LECTURES_RESPONSE: "📚 Lectures API response:",
  LECTURES_SET: "✅ Lectures set:",
  API_FAILED: "❌ API returned success=false:",
  FETCH_ERROR: "❌ Error fetching lectures:",
  AUTO_REFRESH: "🔄 Auto-refreshing lectures...",
  APP_FOREGROUND: "📱 App came to foreground - refreshing lectures",
  LECTURE_ENDED_EVENT: "Lecture ended event received:",
  UPDATING_STATUS: "Updating lecture status to ended",
  JOINED_ROOM: "Joined socket room for lecture:",
  LEFT_ROOM: "Left socket room for lecture:",
  FETCHING_DETAILS: "📥 Fetching lecture details for:",
  DETAILS_FETCHED: "✅ Lecture details fetched:",
  DETAILS_FAILED: "❌ Failed to fetch lecture details",
  DETAILS_ERROR: "❌ Error fetching lecture details:",
};
