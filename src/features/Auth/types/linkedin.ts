import { Dispatch, SetStateAction } from "react";

export interface LinkedInAuthProps {
  authType: "login" | "logout" | "deleteAccount";
  isLinkedInModalVisible: boolean;
  setIsLinkedInModalVisible: Dispatch<SetStateAction<boolean>>;
}
