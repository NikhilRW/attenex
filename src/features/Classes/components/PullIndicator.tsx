import { styles } from "@classes/styles/TeacherDashboard.styles";
import { PullIndicatorProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Canvas, Path } from "@shopify/react-native-skia";
import { View } from "react-native";
import Animated, { useDerivedValue } from "react-native-reanimated";
import { useUnistyles, withUnistyles } from "react-native-unistyles";

const ProgressPath = withUnistyles(Path, (theme) => ({
  color: theme.primary.main,
}));

const AddIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const PullIndicator: React.FC<PullIndicatorProps> = ({
  circlePath,
  pullIndicatorStyle,
  pullProgress,
}) => {
  const actualPullProgress = useDerivedValue(
    () => pullProgress.value,
    [pullProgress],
  );

  const { theme, rt } = useUnistyles();

  return (
    <Animated.View style={[styles.pullIndicator, pullIndicatorStyle]}>
      <View style={styles.pullIndicatorOuter}>
        <Canvas style={styles.pullIndicatorCanvas}>
          <ProgressPath
            color={
              rt.themeName === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)"
            }
            path={circlePath}
            style="stroke"
            strokeWidth={4}
          />
          <Path
            color={theme.primary.main}
            path={circlePath}
            style="stroke"
            strokeWidth={4}
            start={0}
            end={actualPullProgress}
            strokeCap="round"
          />
        </Canvas>
        <View style={styles.pullIndicatorInner}>
          <AddIcon name="add" size={24} />
        </View>
      </View>
      {/* <Text style={[styles.pullText, { color: colors.text.secondary, marginTop: 8 }]}>Create New Lecture</Text> */}
    </Animated.View>
  );
};

export default PullIndicator;
