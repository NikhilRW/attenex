import { BlurMethod, BlurTargetView, BlurTint, BlurView } from "expo-blur";
import React from "react";
import {
  Platform,
  StyleProp,
  StyleSheet as RNStyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { useGlassBlurStore } from "@shared/stores/glassBlurStore";

type GlassBackgroundProps = {
  intensity?: number;
  tint?: BlurTint;
  overlayColor?: string;
  androidBlurMethod?: BlurMethod;
};

type GlassSurfaceProps = ViewProps &
  GlassBackgroundProps & {
    style?: StyleProp<ViewStyle>;
  };

const DEFAULT_INTENSITY = 18;
const DEFAULT_OVERLAY_COLOR = "rgba(255, 255, 255, 0.22)";
const DEFAULT_ANDROID_BLUR_METHOD: BlurMethod = "dimezisBlurViewSdk31Plus";

export const GlassBlurTargetView = ({
  children,
  style,
  ...viewProps
}: ViewProps) => {
  const blurTargetRef = useGlassBlurStore((state) => state.blurTargetRef);

  return (
    <BlurTargetView ref={blurTargetRef} style={style} {...viewProps}>
      {children}
    </BlurTargetView>
  );
};

export const GlassBackground = ({
  intensity = DEFAULT_INTENSITY,
  tint = "default",
  overlayColor,
  androidBlurMethod = DEFAULT_ANDROID_BLUR_METHOD,
}: GlassBackgroundProps) => {
  const blurTargetRef = useGlassBlurStore((state) => state.blurTargetRef);
  const resolvedOverlayColor = overlayColor ?? DEFAULT_OVERLAY_COLOR;
  const androidBlurProps =
    Platform.OS === "android"
      ? {
          blurMethod: androidBlurMethod,
          blurReductionFactor: 2,
          blurTarget: blurTargetRef ?? undefined,
        }
      : {};

  return (
    <>
      <BlurView
        intensity={intensity}
        pointerEvents="none"
        tint={tint}
        style={RNStyleSheet.absoluteFill}
        {...androidBlurProps}
      />
      {resolvedOverlayColor ? (
        <View
          pointerEvents="none"
          style={[
            RNStyleSheet.absoluteFill,
            { backgroundColor: resolvedOverlayColor },
          ]}
        />
      ) : null}
    </>
  );
};

export const GlassSurface = ({
  children,
  intensity,
  tint,
  overlayColor,
  androidBlurMethod,
  style,
  ...viewProps
}: GlassSurfaceProps) => {
  return (
    <View style={[styles.surface, style]} {...viewProps}>
      <GlassBackground
        intensity={intensity}
        tint={tint}
        overlayColor={overlayColor}
        androidBlurMethod={androidBlurMethod}
      />
      {children}
    </View>
  );
};

const styles = RNStyleSheet.create({
  surface: {
    overflow: "hidden",
    position: "relative",
  },
});
