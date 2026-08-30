import { Easing } from "react-native-reanimated";

import { DateFilterType } from "../types/common";

export const filters = [
  "7d" as const,
  "1m" as const,
  "3m" as const,
  "1y" as const,
  "custom" as const,
];
export const RECT_WIDTH = 45;
export const RECT_HEIGHT = 45;
export const FONT_PATH = "../../../../assets/ttfs/Inter.ttf";
export const CUSTOM_FONT = require("../../../../assets/ttfs/Inter.ttf");
export const FONT_SIZE = 16;
export const EMPTY_STRING = "";
export const RECTANGLE_RADIUS_X_AND_Y = {
  x: 15,
  y: 15,
};
export const AI_IMAGE = require("../../../../assets/images/ai.png");

export const breathingAnimationConfiguration = {
  duration: 800,
  easing: Easing.bezierFn(0.45, 0, 0.55, 1),
};

export const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const filterLabels: Record<DateFilterType, string> = {
  "7d": "7 days",
  "1m": "1 month",
  "3m": "3 months",
  "1y": "1 year",
  custom: "Custom",
};

export const DARK_TOOLTIP_BACKGROUND = "#131829";
export const DARK_TOOLTIP_TEXT = "#FFFFFF";
export const LIGHT_TOOLTIP_BACKGROUND = "#CBD5E1";
export const LIGHT_TOOLTIP_TEXT = "#0F172A";
