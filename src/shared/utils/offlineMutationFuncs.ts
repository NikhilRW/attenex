import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { userService } from "../services/userService";
import { useAuthStore } from "../stores/authStore";

export const handleNameUpdateMutateFn = async () => {
  impactAsync(ImpactFeedbackStyle.Medium);
  const res = await userService.updateUserFullName(
    useAuthStore.getState().user.name || "",
  );
  return res;
};
