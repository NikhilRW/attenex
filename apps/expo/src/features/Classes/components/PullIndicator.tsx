import { View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { Canvas, Path } from "@shopify/react-native-skia";
import Animated, { useDerivedValue } from "react-native-reanimated";
import { useUnistyles, withUnistyles } from "react-native-unistyles";

import { styles } from "@classes/styles/TeacherDashboard.styles";
import { PullIndicatorProps } from "@classes/types/props";

const ProgressTrackPath = withUnistyles(Path, (_theme, rt) => ({
  color: rt.themeName === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
}));

const AddIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const PullIndicator: React.FC<PullIndicatorProps> = ({
  circlePath,
  pullIndicatorStyle,
  pullProgress,
}) => {
  const actualPullProgress = useDerivedValue(() => pullProgress.value, [pullProgress]);
  const { theme } = useUnistyles();

  return (
    <Animated.View style={[styles.pullIndicator, pullIndicatorStyle]}>
      <View style={styles.pullIndicatorOuter}>
        <Canvas style={styles.pullIndicatorCanvas}>
          <ProgressTrackPath path={circlePath} style="stroke" strokeWidth={4} />
          <Path
            path={circlePath}
            style="stroke"
            strokeWidth={4}
            start={0}
            end={actualPullProgress}
            color={theme.primary.main}
            strokeCap="round"
          />
        </Canvas>
        <View style={styles.pullIndicatorInner}>
          <AddIcon name="add" size={24} />
        </View>
      </View>
    </Animated.View>
  );
};

export default PullIndicator;
