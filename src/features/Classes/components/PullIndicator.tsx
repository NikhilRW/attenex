import { StyleProp, View, ViewStyle } from "react-native";
import { styles } from "../styles/TeacherDashboard.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Canvas, Path, SkPath } from "@shopify/react-native-skia";
import Animated, { AnimatedStyle } from "react-native-reanimated";
const PullIndicator = ({
  animatedContainerStyle,
  pullIndicatorStyle,
  pullProgress,
  circlePath,
}: {
  pullIndicatorStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  pullProgress: number;
  circlePath:  SkPath;
  animatedContainerStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}) => {
  const { colors, isDark } = useTheme();
  return (
      <Animated.View style={[styles.pullIndicator, pullIndicatorStyle]}>
        <View
          style={{
            width: 60,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Canvas style={{ position: "absolute", width: 60, height: 60 }}>
            <Path
              path={circlePath}
              color={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}
              style="stroke"
              strokeWidth={4}
            />
            <Path
              path={circlePath}
              color={colors.primary.main}
              style="stroke"
              strokeWidth={4}
              start={0}
              end={pullProgress}
              strokeCap="round"
            />
          </Canvas>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 40,
              backgroundColor: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(255,255,255,0.8)",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Ionicons name="add" size={24} color={colors.primary.main} />
          </View>
        </View>
        {/* <Text style={[styles.pullText, { color: colors.text.secondary, marginTop: 8 }]}>
                     Create New Lecture
                   </Text> */}
      </Animated.View>
  );
};

export default PullIndicator;
