import { storage } from "@shared/utils/mmkvStorage";
import {
  Accuracy,
  requestBackgroundPermissionsAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from "expo-location";
import { defineTask, isTaskRegisteredAsync } from "expo-task-manager";
import { sendPing } from "./attendanceService";
import { parseLectureId } from "@/shared/utils/parsers";
import { IS_TESTING } from "../constants/common";

const LOCATION_TASK_NAME = "background-location-task";

defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Background location task error:", error);
    return;
  }
  if (data) {
    const { locations } = data as any;
    const location = locations[0];

    if (location) {
      try {
        // Retrieve current lecture ID from storage
        const lectureId = storage.getString("currentLectureId");

        if (lectureId) {
          console.log("Sending background ping for lecture:", lectureId);
          const latitude = location.coords.latitude;
          const longitude = location.coords.longitude;
          if (
            latitude &&
            typeof latitude === "number" &&
            longitude &&
            typeof longitude === "number"
          )
            await sendPing(
              lectureId,
              location.coords.latitude,
              location.coords.longitude,
            );
        }
      } catch (err) {
        console.error("Error in background task:", err);
      }
    }
  }
});

export const startBackgroundTracking = async (lectureId: string) => {
  try {
    if (parseLectureId(lectureId)) {
      storage.set("currentLectureId", lectureId);
      const { status } = await requestBackgroundPermissionsAsync();
      if (status === "granted") {
        await startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Accuracy.Highest,
          timeInterval: __DEV__ && IS_TESTING? 10 * 1000 : 3 * 60 * 1000, // Check every 3 minutes (10s in dev for testing)
          distanceInterval: 1,
          foregroundService: {
            notificationTitle: "Attendance Active",
            notificationBody: "Verifying your presence in class...",
            notificationColor: "#4CAF50",
          },
          pausesUpdatesAutomatically: false,
        });
        console.log("Background tracking started");
      }
    }
  } catch (error) {
    console.error("Failed to start background tracking", error);
  }
};

export const stopBackgroundTracking = async () => {
  try {
    const isRegistered = await isTaskRegisteredAsync(LOCATION_TASK_NAME);
    if (isRegistered) {
      await stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      storage.remove("currentLectureId");
      console.log("Background tracking stopped");
    }
  } catch (error) {
    console.error("Failed to stop background tracking", error);
  }
};
