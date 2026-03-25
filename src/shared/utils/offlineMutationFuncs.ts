import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { userService } from "../services/userService";
import * as Haptics from "expo-haptics";
import { UserRole } from "@/features/Settings/types/common";
import { lectureService } from "@/features/Classes/services/lectureService";
import {
  Accuracy,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import {
  CreateLectureVariables,
  LectureWithCount,
} from "@/features/Classes/types";

export const nameUpdateMutateFn = async (username: string) => {
  impactAsync(ImpactFeedbackStyle.Medium);
  const res = await userService.updateUserFullName(username);
  return res;
};

export const roleUpdateMutateFn = async (role: UserRole) => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  const res = await userService.updateUserRole(role);
  return res;
};

export const createNewClassMutateFn = async (className: string) => {
  if (!className.trim()) {
    return;
  }
  impactAsync(ImpactFeedbackStyle.Medium);
  const res = await lectureService.addTeacherClass(className.trim());
  return res;
};

export const createLectureMutateFn = async ({
  lectureName,
  selectedClass,
  customDuration,
  duration,
  alert,
}: CreateLectureVariables) => {
  if (!lectureName || !selectedClass) {
    alert("Missing Information", "Please fill in all fields.");
    return;
  }

  const finalDuration = duration === -1 ? parseInt(customDuration) : duration;
  if (isNaN(finalDuration) || finalDuration <= 0) {
    alert("Invalid Duration", "Please enter a valid duration in minutes.");
    return;
  }
  const { status } = await requestForegroundPermissionsAsync();
  if (status !== "granted") {
    alert("Permission denied", "Location is required to start a lecture.");
    return;
  }

  const location = await getCurrentPositionAsync({
    accuracy: Accuracy.Highest,
  });

  const res = await lectureService.createLecture(
    lectureName,
    selectedClass,
    finalDuration,
    location.coords.latitude,
    location.coords.longitude,
  );

  return res;
};

export const deleteLectureMutateFn = async ({
  lecture,
}: {
  lecture: LectureWithCount;
}) => {
  const res = await lectureService.deleteLecture(lecture.id);
  return res;
};

export const updateLectureMutateFn = async ({
  lectureId,
  title,
  duration,
}: {
  lectureId: string;
  title: string;
  duration: number;
}) => {
  const res = await lectureService.updateLecture(lectureId, {
    title,
    duration,
  });
  return res;
};
