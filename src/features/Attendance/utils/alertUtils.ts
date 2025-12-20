import { Alert } from "react-native";

/**
 * Show a success alert
 */
export const showSuccessAlert = (title: string, message: string) => {
  Alert.alert(title, message);
};

/**
 * Show an error alert
 */
export const showErrorAlert = (title: string, message: string) => {
  Alert.alert(title, message);
};

/**
 * Show a confirmation alert with callback
 */
export const showConfirmationAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  Alert.alert(title, message, [
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
  confirmText: string,
  onConfirm: () => void
) => {
  Alert.alert(title, message, [
    { text: "Cancel", style: "cancel" },
    {
      text: confirmText,
      style: "destructive",
      onPress: onConfirm,
    },
  ]);
};
