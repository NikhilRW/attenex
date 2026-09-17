import { Text, View } from "react-native";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { AuthFooterProps } from "@auth/types/props";

import { styles } from "../../styles/AuthFooter.styles";

const AuthFooter: React.FC<AuthFooterProps> = ({ text, linkText, onLinkPress }) => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{text}</Text>
      <TouchableOpacity onPress={onLinkPress} haptic="selection">
        <Text style={styles.signUpLink}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthFooter;
