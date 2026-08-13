import { FC } from "react";
import { Image, TouchableOpacity } from "react-native";

import { AI_IMAGE } from "../constants/common";
import { styles } from "../styles/AiFavButton.styles";
import { AiFavButtonProps } from "../types/props";

const AiFavButton: FC<AiFavButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.favButtonContainer} onPress={onPress}>
      <Image source={AI_IMAGE} height={25} width={25} style={styles.favButtonIcon} />
    </TouchableOpacity>
  );
};

export default AiFavButton;
