import { AuthFooterProps } from "@auth/types/props";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { TouchableOpacity } from "@/shared/components/TouchableOpacity";

const AuthFooter: React.FC<AuthFooterProps> = ({
  text,
  linkText,
  onLinkPress,
}) => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{text}</Text>
      <TouchableOpacity onPress={onLinkPress} haptic="selection">
        <Text style={styles.signUpLink}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

// TODO: move to right file or folder.

const styles = StyleSheet.create((theme) => ({
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    fontSize: 14,
    color: theme.text.secondary,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.primary.main,
  },
}));

export default AuthFooter;
