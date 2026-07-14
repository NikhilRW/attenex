import { useCallback } from "react";

import { useAlerts } from "react-native-paper-alerts";
import type { AlertButton, AlertsMethods } from "react-native-paper-alerts/lib/typescript/type";

import { triggerSelectionHapticOnCallback } from "@shared/utils/haptics";

const DEFAULT_ALERT_BUTTON_TEXT = "Ok";

const addSelectionHapticToDefaultButtons = (buttons?: AlertButton[]): AlertButton[] | undefined => {
  if (buttons === undefined) {
    return [
      {
        text: DEFAULT_ALERT_BUTTON_TEXT,
        onPress: triggerSelectionHapticOnCallback(),
      },
    ];
  }

  return buttons.map((button) => {
    const isDefaultButton = button.style === undefined || button.style === "default";

    if (!isDefaultButton || button.onPress) {
      return button;
    }

    return {
      ...button,
      onPress: triggerSelectionHapticOnCallback(),
    };
  });
};

export const useHapticAlerts = () => {
  const alerts = useAlerts();

  const alert = useCallback<AlertsMethods["alert"]>(
    (title, message, buttons, options) => {
      alerts.alert(title, message, addSelectionHapticToDefaultButtons(buttons), options);
    },
    [alerts],
  );
  return { alert };
};
