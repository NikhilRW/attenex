import { AlertFunction } from "../types/common";

/**
 * Show a success alert
 */
export const showSuccessAlert = (
  title: string,
  message: string,
  alert: AlertFunction,
) => {
  alert(title, message);
};

/**
 * Show an error alert
 */
export const showErrorAlert = (
  title: string,
  message: string,
  alert: AlertFunction,
) => {
  alert(title, message);
};

/**
 * Show a confirmation alert with callback
 */
export const showConfirmationAlert = (
  title: string,
  message: string,
  alert: AlertFunction,
  onConfirm: () => void,
  onCancel?: () => void,
) => {
  alert(title, message, [
    {
      text: "Cancel",
      style: "cancel",
      onPress: onCancel,
    },
    {
      text: "OK",
      onPress: onConfirm,
    },
  ]);
};

/**
 * Show a destructive confirmation alert
 */
export const showDestructiveAlert = (
  title: string,
  message: string,
  alert: AlertFunction,
  confirmText: string,
  onConfirm: () => void,
) => {
  alert(title, message, [
    { text: "Cancel", style: "cancel" },
    {
      text: confirmText,
      style: "destructive",
      onPress: onConfirm,
    },
  ]);
};
