import { userService } from "@/shared/services/userService";
import { mmkvStorage } from "@shared/utils/mmkvStorage";
import { defineTask } from "expo-task-manager";
import { BACKGROUND_TASK_IDENTIFIER } from "../constants/common";

export const setLocalStorageDisplayName = (name: string) => {
  mmkvStorage.setItem("new-display-name", name);
};

export const getLocalStorageDisplayName = (): string | null => {
  return mmkvStorage.getItem("new-display-name");
};

export const setupBackgroundNameUpdateTask = () => {
  defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
    console.log("Background Task Started");
    const newDisplayName = getLocalStorageDisplayName();
    if (newDisplayName) {
      const response = await userService.updateUserFullName(newDisplayName);
      console.log("Background Task Response  : " + response.success);
      if (response.success) {
        setLocalStorageDisplayName("");
      }
    } else {
      console.log("No new display name found");
    }
  });
};
