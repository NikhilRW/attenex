import { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { withUnistyles } from "react-native-unistyles";

import CustomDateField from "./CustomDateField";
import { styles } from "../styles/CustomDateBottomSheet.styles";
import { CustomDateBottomSheetProps } from "../types/props";

const UniTrueSheet = withUnistyles(TrueSheet);
const CustomDateBottomSheet: FC<CustomDateBottomSheetProps> = ({
  customStartDate,
  customEndDate,
  setCustomStartDate,
  setCustomEndDate,
  ref,

  applyDateFilter,
}) => {
  return (
    <UniTrueSheet
      style={styles.sheet}
      backgroundColor="transparent"
      ref={ref}
      detents={["auto", 0.55]}
    >
      <View style={styles.content}>
        <CustomDateField
          defaultPlaceholder="Select Start Date"
          date={customStartDate}
          setDate={setCustomStartDate}
        />
        <CustomDateField
          defaultPlaceholder="Select End Date"
          date={customEndDate}
          setDate={setCustomEndDate}
        />
        <TouchableOpacity onPress={applyDateFilter} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Date Filter</Text>
        </TouchableOpacity>
      </View>
    </UniTrueSheet>
  );
};
export default CustomDateBottomSheet;
