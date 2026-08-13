import { FC, useCallback, useMemo, useState } from "react";
import { View, Text } from "react-native";

import DateTimePicker, { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { UniMaterialCommunityIcons } from "@/shared/components/UnistylesComponents";

import { styles } from "../styles/CustomDateField.styles";
import { CustomDateFiledProps } from "../types/props";

const CustomDateField: FC<CustomDateFiledProps> = ({ defaultPlaceholder, date, setDate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const onDateChange = useCallback(
    (_event: DateTimePickerChangeEvent, selectedDate: Date | undefined) => {
      if (selectedDate) {
        setDate(selectedDate);
      }
      setShowDatePicker(false);
    },
    [setDate],
  );
  const valueForDatePicker = useMemo(() => date || new Date(), [date]);
  const openDatePicker = useCallback(() => {
    setShowDatePicker(true);
  }, []);
  const onDismiss = useCallback(() => {
    setShowDatePicker(false);
  }, []);

  const isDateNull = useMemo(() => date === null, [date]);
  return (
    <View>
      <TouchableOpacity
        haptic="selection"
        onPress={openDatePicker}
        style={styles.dateFieldContainer}
      >
        <Text style={[styles.dateFieldText, isDateNull && styles.dateFieldTextMuted]}>
          {isDateNull ? defaultPlaceholder : date?.toDateString()}
        </Text>
        <UniMaterialCommunityIcons
          uniProps={(theme) => ({ color: isDateNull ? theme.text.muted : theme.text.primary })}
          name="calendar"
          size={20}
        />
      </TouchableOpacity>
      {showDatePicker ? (
        <DateTimePicker
          mode="date"
          onDismiss={onDismiss}
          value={valueForDatePicker}
          onValueChange={onDateChange}
        />
      ) : null}
    </View>
  );
};

export default CustomDateField;
