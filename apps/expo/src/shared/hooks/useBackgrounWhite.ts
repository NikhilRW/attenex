import { useTheme } from "expo-router";

export const useBackgroundWhite = () => {
  const { colors } = useTheme();
  // eslint-disable-next-line
  colors.background = "transparent";
};
