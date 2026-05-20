import { Modal } from "react-native";
import { withUnistyles } from "react-native-unistyles";

export const UniModal = withUnistyles(Modal, (theme) => ({
  backdropColor: theme.background.overlay,
}));
