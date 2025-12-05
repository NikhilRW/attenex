import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { sendPing } from "./attendanceService";

export const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
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
        const lectureId = await AsyncStorage.getItem("currentLectureId");

        if (lectureId) {
          console.log("Sending background ping for lecture:", lectureId);
          await sendPing(
            lectureId,
            location.coords.latitude,
            location.coords.longitude
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
    await AsyncStorage.setItem("currentLectureId", lectureId);

    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 10 * 60 * 1000, // Check every 10 minutes
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
  } catch (error) {
    console.error("Failed to start background tracking", error);
  }
};

export const stopBackgroundTracking = async () => {
  try {
    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    if (isRegistered) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      await AsyncStorage.removeItem("currentLectureId");
      console.log("Background tracking stopped");
    }
  } catch (error) {
    console.error("Failed to stop background tracking", error);
  }
};
