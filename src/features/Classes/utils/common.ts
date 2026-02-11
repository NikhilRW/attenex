import { mmkvStorage } from "@/shared/utils";
import { Dimensions } from "react-native";

export const getMinHeightForScrollView = () => {
  return Dimensions.get("window").height + 40;
};

export const getExistingClassesFromLocalStorage = () => {
  const savedClasses = mmkvStorage.getItem("user_created_classes");
  const parsedClasses = JSON.parse(savedClasses || "[]");
  return parsedClasses;
};
