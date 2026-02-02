import { userService } from "@/shared/services/userService";
import { useAuthStore } from "@/shared/stores/authStore";
import { defineTask } from "expo-task-manager";

export const scheduleDisplayNameChangeTask = () => {
  const newTask = defineTask("DISPLAY_NAME_CHANGE", async () => {
    userService.updateUserFullName(useAuthStore.getState().user?.name!);
  });
};
