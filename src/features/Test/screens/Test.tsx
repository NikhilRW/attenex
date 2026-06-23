// import { router } from "expo-router";
// import { useCallback, useEffect, useState } from "react";
// import { Button, Text, View } from "react-native";
// import { fetch as nitroFetch } from "react-native-nitro-fetch";
// import { StyleSheet } from "react-native-unistyles";
// import http from "@shared/utils/http";

// const REQUEST_COUNT = 100;
// const TEST_URL = "https://jsonplaceholder.typicode.com/todos/1";

// type BenchmarkResults = {
//   axiosFetch: number | null;
//   nativeFetch: number | null;
//   nitroFetch: number | null;
// };

// const emptyResults: BenchmarkResults = {
//   axiosFetch: null,
//   nativeFetch: null,
//   nitroFetch: null,
// };

// const getElapsedTime = async (request: () => Promise<void>) => {
//   const startedAt = performance.now();

//   for (let i = 0; i < REQUEST_COUNT; i += 1) {
//     await request();
//   }

//   return performance.now() - startedAt;
// };

// const assertOkResponse = (response: Response) => {
//   if (!response.ok) {
//     throw new Error(`Request failed with status ${response.status}`);
//   }
// };

// const getWinnerText = (results: BenchmarkResults) => {
//   const entries = [
//     { label: "Native Fetch", time: results.nativeFetch },
//     { label: "Nitro Fetch", time: results.nitroFetch },
//     { label: "Axios Fetch Adapter", time: results.axiosFetch },
//   ];

//   if (entries.some((entry) => entry.time === null)) {
//     return "Winner: Running...";
//   }

//   const winner = entries.reduce((fastest, entry) =>
//     entry.time! < fastest.time! ? entry : fastest,
//   );

//   return `Winner: ${winner.label} (${winner.time!.toFixed(2)} ms)`;
// };

// const Test = () => {
//   const [results, setResults] = useState<BenchmarkResults>(emptyResults);
//   const [error, setError] = useState<string | null>(null);

//   const measurePerformance = useCallback(async () => {
//     setError(null);
//     setResults(emptyResults);

//     try {
//       const nativeFetchTime = await getElapsedTime(async () => {
//         const response = await fetch(TEST_URL);
//         assertOkResponse(response);
//         await response.json();
//       });

//       const nitroFetchTime = await getElapsedTime(async () => {
//         const response = await nitroFetch(TEST_URL);
//         assertOkResponse(response);
//         await response.json();
//       });

//       const axiosFetchTime = await getElapsedTime(async () => {
//         await http.get(TEST_URL);
//       });

//       setResults({
//         axiosFetch: axiosFetchTime,
//         nativeFetch: nativeFetchTime,
//         nitroFetch: nitroFetchTime,
//       });
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Benchmark failed");
//     }
//   }, []);

//   useEffect(() => {
//     measurePerformance();
//   }, [measurePerformance]);

//   if (!__DEV__) {
//     router.back();
//     return null;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Network Benchmark</Text>
//       <Text style={styles.subtitle}>{REQUEST_COUNT} sequential requests</Text>

//       <Text style={styles.text}>
//         Native Fetch Time:{" "}
//         {results.nativeFetch === null
//           ? "Running..."
//           : `${results.nativeFetch.toFixed(2)} ms`}
//       </Text>
//       <Text style={styles.text}>
//         Nitro Fetch Time:{" "}
//         {results.nitroFetch === null
//           ? "Running..."
//           : `${results.nitroFetch.toFixed(2)} ms`}
//       </Text>
//       <Text style={styles.text}>
//         Axios Fetch Adapter Time:{" "}
//         {results.axiosFetch === null
//           ? "Running..."
//           : `${results.axiosFetch.toFixed(2)} ms`}
//       </Text>
//       <Text style={styles.winnerText}>{getWinnerText(results)}</Text>

//       {error !== null && <Text style={styles.errorText}>{error}</Text>}
//       <Button title="Run Again" onPress={measurePerformance} />
//     </View>
//   );
// };

// export default Test;

// const styles = StyleSheet.create((theme) => ({
//   container: {
//     backgroundColor: theme.background.primary,
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//     gap: 10,
//   },
//   title: {
//     color: theme.text.primary,
//     fontSize: 24,
//     fontWeight: "800",
//   },
//   subtitle: {
//     color: theme.text.secondary,
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   text: {
//     color: theme.text.primary,
//     fontSize: 16,
//     fontWeight: "600",
//     textAlign: "center",
//   },
//   winnerText: {
//     color: theme.accent.green,
//     fontSize: 17,
//     fontWeight: "800",
//     marginTop: 6,
//     textAlign: "center",
//   },
//   errorText: {
//     color: theme.accent.red,
//     fontSize: 14,
//     fontWeight: "600",
//     marginTop: 8,
//     textAlign: "center",
//   },
// }));

// import { View, Text } from "react-native";
// import React, { useEffect } from "react";
// import { Canvas, Path, Skia, usePathValue } from "@shopify/react-native-skia";
// import { useSharedValue, withTiming } from "react-native-reanimated";
// const path = Skia.Path.Make();
// const Test = () => {
//   const degree = useSharedValue(67);
//   const borderPath = usePathValue((path) => {
//     "worklet";
//     path.reset();
//     path.addArc({ x: 5, y: 5, width: 60, height: 60 }, 0, degree.value);
//     return path;
//   }, path);
//   useEffect(() => {
//     degree.value = withTiming(360, { duration: 2000 });
//   }, [degree]);
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text>Test</Text>
//       <Canvas
//         style={{
//           width: 200,
//           height: 200,
//         }}
//       >
//         <Path
//           path={borderPath}
//           color={"black"}
//           start={0}
//           end={1}
//           strokeWidth={10}
//           style={"stroke"}
//         />
//       </Canvas>
//     </View>
//   );
// };

// export default Test;

import { View, Text } from 'react-native'
import React from 'react'

const Test = () => {
  return (
    <View>
      <Text>Test</Text>
    </View>
  )
}

export default Test