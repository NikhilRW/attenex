import LinkedInModal from "react-native-linkedin-oauth2";
import { useLinkedInAuth } from "../hooks/useLinkedInAuth";

export const LinkedInAuth = () => {
  const { linkedInProps } = useLinkedInAuth();

  return <LinkedInModal {...linkedInProps} />;
};
