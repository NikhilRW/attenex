import { StyleSheet } from "react-native-unistyles";
import { CUSTOM_TAB_BAR_WIDTH } from "../constants/ui";

export const styles = StyleSheet.create((theme) => ({
  container: {
    height: 70,
    position: "absolute",
    left: "50%",
    transform: [
      {
        translateX: "-50%",
      },
    ],
    marginHorizontal: "auto",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    borderRadius: 30,
    elevation: 0,
    zIndex: 2,
    borderWidth: 1,
    backgroundColor: theme.surface.cardBg,
    borderColor: theme.surface.glassBorder,
    bottom: 0,
  },
  hidden: {
    display: "none",
  },
  navigationButton: {
    flexDirection: "column",
    width: CUSTOM_TAB_BAR_WIDTH,
    height: 60,
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 30,
    position: "relative",
  },
  activeBackground: {
    position: "absolute",
    top: 5,
    borderRadius: 30,
    backgroundColor: theme.primary.glow,
  },
  tabLabel: (isActivated: boolean) => ({
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
    color: isActivated ? theme.primary.main : theme.text.secondary,
  }),
}));
