import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { userService } from "../services/userService";
import * as Haptics from "expo-haptics";
import { UserRole } from "@/features/Settings/types";

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
