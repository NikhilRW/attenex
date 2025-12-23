import { LinkedInAuth } from "@/src/features/Auth/screens/LinkedInAuth";
import { LinkedInAuthProps } from "../types/linkedin";

const LinkedInAuthComponent = ({
  authType,
  isLinkedInModalVisible,
  setIsLinkedInModalVisible,
}: LinkedInAuthProps) => {
  return (
    <LinkedInAuth
      authType={authType}
      isLinkedInModalVisible={isLinkedInModalVisible}
      setIsLinkedInModalVisible={setIsLinkedInModalVisible}
    />
  );
};

export default LinkedInAuthComponent;
