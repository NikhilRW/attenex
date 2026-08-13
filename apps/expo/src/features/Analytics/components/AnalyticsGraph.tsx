import { FC, useCallback } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { LineGraph } from "react-native-graph";
import type { GraphPoint } from "react-native-graph";
import { useSharedValue } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

import { UniFontAwesome6 } from "@/shared/components/UnistylesComponents";

import CustomSelectionDot from "./CustomSelectionDot";
import { styles } from "../styles/AnalyticsGraph.styles";
import { AnalyticsGraphProps } from "../types/props";

const UniAcitivityIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.primary.glow,
  size: "large" as const,
}));

const AnalyticsGraph: FC<AnalyticsGraphProps> = ({ points, isLoading }) => {
  const selectedDateCountText = useSharedValue<string>("");
  const handlePointSelected = useCallback(
    (p: GraphPoint) => {
      selectedDateCountText.set(`${p.value}`);
    },
    [selectedDateCountText],
  );

  return (
    <View style={styles.graphContainer}>
      {points.length === 0 && !isLoading ? (
        <View style={styles.noDataFoundContainer}>
          <UniFontAwesome6
            name="face-sad-tear"
            size={60}
            style={styles.noDataFoundIcon}
            uniProps={(theme) => ({
              color: theme.text.secondary,
            })}
          />
          <Text style={styles.noDataFoundText}>No Data Found</Text>
        </View>
      ) : null}

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <UniAcitivityIndicator />
        </View>
      ) : null}
      <LineGraph
        style={isLoading || points.length === 0 ? styles.hideGraph : styles.graph}
        animated={true}
        points={points}
        verticalPadding={15}
        horizontalPadding={10}
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
    </View>
  );
};

export default AnalyticsGraph;
