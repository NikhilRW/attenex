import { useEffect } from "react";

import { queryClient } from "../constants/tanstackConfig";
import { setupTanstackForReactNative } from "../utils/tanstack";

export const useAppQueryBootstrap = () => {
  useEffect(() => {
    let tanstackCleanUp: (() => void) | undefined;
    const interactionHandle = requestIdleCallback(() => {
      tanstackCleanUp = setupTanstackForReactNative(queryClient);
    });
    return () => {
      cancelIdleCallback(interactionHandle);
      if (tanstackCleanUp) {
        tanstackCleanUp();
      }
    };
  }, []);
};
