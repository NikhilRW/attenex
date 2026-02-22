import { showMessage } from "react-native-flash-message";

export const showInternetNotConnected = () => {
  showMessage({
    message: "Kindly have an active internet connection first",
    type: "danger",
  });
};
