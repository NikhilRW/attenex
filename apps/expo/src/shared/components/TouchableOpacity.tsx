import {
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps,
  ViewProps,
} from "react-native";
import * as Haptics from "expo-haptics";
import {
  triggerImpactHapticOn,
  triggerNotificationHapticOn,
  triggerSelectionHapticOn,
} from "@/shared/utils/haptics";

type ImpactFeedbackStyleObject = typeof Haptics.ImpactFeedbackStyle;
type ImpactFeedbackStyleEnum =
  ImpactFeedbackStyleObject[keyof ImpactFeedbackStyleObject];

export type MyTouchableOpacityProps = {
  haptic?: "selection" | "impact" | "notification";
  impactHapticLevel?: ImpactFeedbackStyleEnum;
  notificationHapticLevel?: Haptics.NotificationFeedbackType;
} & TouchableOpacityProps &
  ViewProps;

export const TouchableOpacity = (props: MyTouchableOpacityProps) => {
  let onPress = props.onPress,
    onPressOut = props.onPressOut;
  if (onPress !== undefined) {
    if (props.haptic === "impact") {
      onPress = triggerImpactHapticOn(onPress, props.impactHapticLevel);
    } else if (props.haptic === "notification") {
      onPress = triggerNotificationHapticOn(
        onPress,
        props.notificationHapticLevel,
      );
    } else if (props.haptic === "selection") {
      onPress = triggerSelectionHapticOn(onPress);
    }
  }
  if (onPressOut !== undefined) {
    if (props.haptic === "impact") {
      onPressOut = triggerImpactHapticOn(onPressOut, props.impactHapticLevel);
    } else if (props.haptic === "notification") {
      onPressOut = triggerNotificationHapticOn(
        onPressOut,
        props.notificationHapticLevel,
      );
    } else if (props.haptic === "selection") {
      onPressOut = triggerSelectionHapticOn(onPressOut);
    }
  }
  return (
    <RNTouchableOpacity
      {...props}
      activeOpacity={0.91}
      onPress={onPress}
      onPressOut={onPressOut}
    />
  );
};
