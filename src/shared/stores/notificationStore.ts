import { create } from "zustand";

interface NotificationState {
  hasHandledKilledStateNotification: boolean;
  setHasHandledKilledStateNotification: (value: boolean) => void;
  resetNotificationState: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  hasHandledKilledStateNotification: false,
  setHasHandledKilledStateNotification: (value: boolean) =>
    set({ hasHandledKilledStateNotification: value }),
  resetNotificationState: () =>
    set({ hasHandledKilledStateNotification: false }),
}));
