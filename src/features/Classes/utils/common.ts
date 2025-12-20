import { Dimensions } from "react-native";

export const getMinHeightForScrollView = () => {
  return Dimensions.get("window").height + 40;
};
