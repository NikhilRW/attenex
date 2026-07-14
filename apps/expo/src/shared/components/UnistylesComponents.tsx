import { Modal } from "react-native";

import Entypo from "@react-native-vector-icons/entypo";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { withUnistyles } from "react-native-unistyles";

export const UniModal = withUnistyles(Modal, (theme) => ({
  backdropColor: theme.background.overlay,
}));
export const TabEntypo = withUnistyles(Entypo);
export const TabFontAwesome6 = withUnistyles(FontAwesome6);
export const TabIonicons = withUnistyles(Ionicons);
export const TabMaterialCommunityIcons = withUnistyles(MaterialCommunityIcons);
