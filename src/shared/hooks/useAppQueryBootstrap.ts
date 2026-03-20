import { useEffect } from "react";
import { queryClient } from "../constants/tanstackConfig";
import { setupTanstackForReactNative } from "../utils/tanstack";

export const useAppQueryBootstrap = () => {
  useEffect(() => {
    let tanstackCleanUp: (() => void) | undefined;

    const handle = requestIdleCallback(() => {
      tanstackCleanUp = setupTanstackForReactNative(queryClient);
    });

    return () => {
      cancelIdleCallback(handle);
      if (tanstackCleanUp) {
        tanstackCleanUp();
      }
    };
  }, []);
};
