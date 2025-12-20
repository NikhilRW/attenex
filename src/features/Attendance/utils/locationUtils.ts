import * as Location from "expo-location";
import { Alert } from "react-native";
import { ALERT_MESSAGES } from "../constants/studentDashboard.constants";
import { LocationCoords } from "../types/studentDashboard.types";

/**
 * Request location permissions from the user
 * @returns true if permission granted, false otherwise
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert(
        ALERT_MESSAGES.PERMISSION_DENIED.title,
        ALERT_MESSAGES.PERMISSION_DENIED.message
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
};

/**
 * Get current location with highest accuracy
 * @returns Location coordinates or null if failed
 */
export const getCurrentLocation = async (): Promise<LocationCoords | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error getting current location:", error);
    return null;
  }
};

/**
 * Get current location with high accuracy (for verification)
 * @returns Location coordinates or null if failed
 */
export const getCurrentLocationHigh = async (): Promise<LocationCoords | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error getting current location (high):", error);
    return null;
  }
};
