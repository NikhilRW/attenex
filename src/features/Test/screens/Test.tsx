import { Text, View } from "react-native";
import { Color } from "expo-router";
import { StyleSheet } from "react-native-unistyles";

const Test = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
};

export default Test;

const styles = StyleSheet.create(() => ({
  container: {
    backgroundColor: Color.android.dynamic.surfaceContainer,
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  },
  text: {
    color: Color.android.dynamic.onSurface,
    separator: Color.android.dynamic.outlineVariant,
  },
}));
