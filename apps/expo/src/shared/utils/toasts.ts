import * as Haptics from "expo-haptics";
import { MessageOptions, showMessage as rnfsShowMessage } from "react-native-flash-message";

import { isIos } from "../constants/platform";

export const showInternetNotConnected = () => {
  showMessage({
    message: "Kindly have an active internet connection first",
    type: "danger",
  });
};

export const showMessage = (options: MessageOptions) => {
  Haptics.notificationAsync();
  handleIosFloatingMessage(options);
};

export const handleIosFloatingMessage = (options: MessageOptions) => {
  if (isIos) {
    rnfsShowMessage(addFloatingForIOS({ ...options }));
  } else {
    rnfsShowMessage({ ...options });
  }
};

export const addFloatingForIOS = (obj: MessageOptions): MessageOptions => {
  return { ...obj, floating: true };
};
