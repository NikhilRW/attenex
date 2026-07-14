import { GestureResponderEvent } from "react-native";

import * as Haptics from "expo-haptics";

export const triggerSelectionHapticOn = (
  callback: (event: GestureResponderEvent) => void = () => {},
) => {
  return async (event: GestureResponderEvent) => {
    Haptics.selectionAsync();
    callback(event);
  };
};

export const triggerImpactHapticOn = (
  callback: (event: GestureResponderEvent) => void = () => {},
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium,
) => {
  return async (event: GestureResponderEvent) => {
    Haptics.impactAsync(style);
    callback(event);
  };
};

export const triggerNotificationHapticOn = (
  callback: (event: GestureResponderEvent) => void = () => {},
  style: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Warning,
) => {
  return async (event: GestureResponderEvent) => {
    Haptics.notificationAsync(style);
    callback(event);
  };
};

export const triggerSelectionHapticOnCallback = (callback: () => void = () => {}) => {
  return async () => {
    Haptics.selectionAsync();
    callback();
  };
};

export const triggerImpactHapticOnCallback = (
  callback: () => void = () => {},
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium,
) => {
  return async () => {
    Haptics.impactAsync(style);
    callback();
  };
};

export const triggerNotificationHapticOnCallback = (
  callback: () => void = () => {},
  style: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Warning,
) => {
  return async () => {
    Haptics.notificationAsync(style);
    callback();
  };
};
