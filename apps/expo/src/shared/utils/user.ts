import { secureStore } from "./secureStore";

export const getUserAuthToken = async () => {
  return await secureStore.getItem("jwt");
};
