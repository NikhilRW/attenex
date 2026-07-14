import { createRef, RefObject } from "react";
import { View } from "react-native";

import { create } from "zustand";

interface GlassBlurStore {
  blurTargetRef: RefObject<View | null>;
}

export const useGlassBlurStore = create<GlassBlurStore>(() => ({
  blurTargetRef: createRef<View | null>(),
}));
