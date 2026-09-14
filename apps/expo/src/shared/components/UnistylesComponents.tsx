import { Modal } from "react-native";

import Entypo from "@react-native-vector-icons/entypo";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { withUnistyles } from "react-native-unistyles";

export const UniModal = withUnistyles(Modal, (theme) => ({
  backdropColor: theme.background.overlay,
}));
export const UniEntypo = withUnistyles(Entypo);
export const UniFontAwesome6 = withUnistyles(FontAwesome6);
export const UniIonicons = withUnistyles(Ionicons);
export const UniMaterialCommunityIcons = withUnistyles(MaterialCommunityIcons);
