import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { fetch as nitroFetch } from "react-native-nitro-fetch";
import { StyleSheet } from "react-native-unistyles";

const REQUEST_COUNT = 100;
const TEST_URL = "https://jsonplaceholder.typicode.com/todos/1";

type BenchmarkResults = {
  nativeFetch: number | null;
  nitroFetch: number | null;
};

const emptyResults: BenchmarkResults = {
  nativeFetch: null,
  nitroFetch: null,
};

const getElapsedTime = async (request: () => Promise<void>) => {
  const startedAt = performance.now();

  for (let i = 0; i < REQUEST_COUNT; i += 1) {
    await request();
  }

  return performance.now() - startedAt;
};

const assertOkResponse = (response: Response) => {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
};

const Test = () => {
  const [results, setResults] = useState<BenchmarkResults>(emptyResults);
  const [error, setError] = useState<string | null>(null);

  const measurePerformance = useCallback(async () => {
    setError(null);
    setResults(emptyResults);

    try {
      const nativeFetchTime = await getElapsedTime(async () => {
        const response = await fetch(TEST_URL);
        assertOkResponse(response);
        await response.json();
      });

      const nitroFetchTime = await getElapsedTime(async () => {
        const response = await nitroFetch(TEST_URL);
        assertOkResponse(response);
        await response.json();
      });

      setResults({
        nativeFetch: nativeFetchTime,
        nitroFetch: nitroFetchTime,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Benchmark failed");
    }
  }, []);

  useEffect(() => {
    measurePerformance();
  }, [measurePerformance]);

  if (!__DEV__) {
    router.back();
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Benchmark</Text>
      <Text style={styles.subtitle}>{REQUEST_COUNT} sequential requests</Text>

      <Text style={styles.text}>
        Native Fetch Time:{" "}
        {results.nativeFetch === null
          ? "Running..."
          : `${results.nativeFetch.toFixed(2)} ms`}
      </Text>
      <Text style={styles.text}>
        Nitro Fetch Time:{" "}
        {results.nitroFetch === null
          ? "Running..."
          : `${results.nitroFetch.toFixed(2)} ms`}
      </Text>

      {error !== null && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default Test;

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.background.primary,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 10,
  },
  title: {
    color: theme.text.primary,
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: theme.text.secondary,
    fontSize: 14,
    marginBottom: 8,
  },
  text: {
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  errorText: {
    color: theme.accent.red,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
}));
