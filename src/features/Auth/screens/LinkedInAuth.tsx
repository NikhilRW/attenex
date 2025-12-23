import LinkedInModal from "react-native-linkedin-oauth2";
import { useLinkedInAuth } from "../hooks/useLinkedInAuth";
import { LinkedInAuthProps } from "../types/linkedin";

export const LinkedInAuth = (props: LinkedInAuthProps) => {
  const { linkedInProps } = useLinkedInAuth(props);
  return <LinkedInModal {...linkedInProps} />;
};
