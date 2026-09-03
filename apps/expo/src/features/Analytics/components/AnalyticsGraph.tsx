import { FC, useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { LineGraph } from "react-native-graph";
import type { GraphPoint } from "react-native-graph";
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
  useSharedValue,
} from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

import { UniFontAwesome6 } from "@/shared/components/UnistylesComponents";

import CustomSelectionDot from "./CustomSelectionDot";
import { styles } from "../styles/AnalyticsGraph.styles";
import { AnalyticsGraphProps } from "../types/props";
import { formatReadableDate, goToCreateLectureScreen } from "../utils/common";

const UniAcitivityIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.primary.glow,
  size: "large" as const,
}));

const AnalyticsGraph: FC<AnalyticsGraphProps> = ({ points, isLoading }) => {
  const selectedDateCountText = useSharedValue<string>("");
  const [selectedPoint, setSelectedPoint] = useState<GraphPoint | null>(null);
  const displayPoint = useMemo(() => {
    const latestPoint = points[points.length - 1] ?? null;
    if (!selectedPoint) {
      return latestPoint;
    }

    const isSelectedPointVisible = points.some(
      (point) =>
        point.value === selectedPoint.value &&
        point.date.getTime() === selectedPoint.date.getTime(),
    );

    return isSelectedPointVisible ? selectedPoint : latestPoint;
  }, [points, selectedPoint]);

  const handlePointSelected = useCallback(
    (p: GraphPoint) => {
      selectedDateCountText.set(`${p.value}`);
      setSelectedPoint(p);
    },
    [selectedDateCountText],
  );

  return (
    <View style={styles.graphContainer}>
      <View style={styles.graphCard}>
        {points.length === 0 && !isLoading ? (
          <View style={styles.noDataFoundContainer}>
            <UniFontAwesome6
              name="face-sad-tear"
              size={58}
              style={styles.noDataFoundIcon}
              uniProps={(theme) => ({
                color: theme.text.secondary,
              })}
            />
            <Text style={styles.noDataFoundText}>No attendance available</Text>
            <TouchableOpacity onPress={goToCreateLectureScreen} style={styles.createLectureButton}>
              <Text style={styles.createLectureButtonText}>Create a lecture now</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <UniAcitivityIndicator />
          </View>
        ) : null}
        {/* TODO: add proper rounded ness to the graph */}
        {!isLoading && points.length > 0 ? (
          <LineGraph
            style={styles.graph}
            animated={true}
            points={points}
            verticalPadding={20}
            horizontalPadding={20}
            color="#62EC4D"
            lineThickness={4}
            enablePanGesture={true}
            enableIndicator={true}
            indicatorPulsating={true}
            gradientFillColors={["#116e0360", "rgba(57, 255, 20,0.01)"]}
            SelectionDot={(props) => (
              <CustomSelectionDot {...props} selectedValue={selectedDateCountText} />
            )}
            onPointSelected={handlePointSelected}
          />
        ) : null}
      </View>
      {displayPoint && !isLoading ? (
        <View style={styles.detailCardsRow}>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Date</Text>
            <Animated.Text
              key={displayPoint.date.toISOString()}
              entering={FadeInDown.duration(180)}
              exiting={FadeOutUp.duration(120)}
              layout={LinearTransition}
              style={styles.detailValue}
            >
              {formatReadableDate(displayPoint.date)}
            </Animated.Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Students Attended</Text>
            <Animated.Text
              key={String(displayPoint.value)}
              entering={FadeInDown.duration(180)}
              exiting={FadeOutUp.duration(120)}
              layout={LinearTransition}
              style={styles.detailValue}
            >
              {displayPoint.value}
            </Animated.Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default AnalyticsGraph;
