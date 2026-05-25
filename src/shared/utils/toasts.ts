import {
  MessageOptions,
  showMessage as rnfsShowMessage,
} from "react-native-flash-message";
import * as Haptics from "expo-haptics";

export const showInternetNotConnected = () => {
  showMessage({
    message: "Kindly have an active internet connection first",
    type: "danger",
  });
};

export const showMessage = (options: MessageOptions) => {
  Haptics.notificationAsync();
  rnfsShowMessage({ ...options });
};
