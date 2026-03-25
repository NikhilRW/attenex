import { colors } from "@/shared/constants/colors";
import { onlineManager } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NitroImage } from "react-native-nitro-image";
import { Button } from "react-native-paper";

const LOGO_IMAGE = require("@assets/images/logo-transparent.png") as number;
const TEACHER_IMAGE = require("@assets/images/teacher.png") as number;
const STUDENT_IMAGE = require("@assets/images/student.png") as number;

const SAMPLE_IMAGES = [LOGO_IMAGE, TEACHER_IMAGE, STUDENT_IMAGE];

const Test = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    onlineManager.isOnline(),
  );
  const [runId, setRunId] = useState(0);
  const [lastRenderDuration, setLastRenderDuration] = useState<number>();

  const benchmarkStartedAtRef = useRef<number | null>(null);
  const hasCapturedLayoutRef = useRef(false);

  useEffect(() => {
    benchmarkStartedAtRef.current = performance.now();
  }, []);

  const benchmarkImages = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        id: `benchmark-${index}-${runId}`,
        imageSource: SAMPLE_IMAGES[index % 3],
      })),
    [runId],
  );

  const toggleOnlineMode = () => {
    onlineManager.setOnline(!isOnline);
    setIsOnline(!isOnline);
  };

  const rerunBenchmark = () => {
    hasCapturedLayoutRef.current = false;
    benchmarkStartedAtRef.current = performance.now();
    setRunId((current) => current + 1);
  };

  const captureBenchmarkLayout = () => {
    if (hasCapturedLayoutRef.current) {
      return;
    }

    hasCapturedLayoutRef.current = true;
    const startedAt = benchmarkStartedAtRef.current;

    if (startedAt == null) {
      return;
    }

    const duration = performance.now() - startedAt;
    setLastRenderDuration(duration);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nitro Image Experiment</Text>
      <Text style={styles.subtitle}>
        Render the same local assets with `react-native-nitro-image` and use the
        repeated grid to sanity-check native rendering performance.
      </Text>

      <View style={styles.buttonRow}>
        <Button
          contentStyle={styles.button}
          mode="contained"
          onPress={rerunBenchmark}
        >
          <Text style={styles.buttonText}>Re-run benchmark</Text>
        </Button>
        <Button
          contentStyle={styles.button}
          testID="toggleButton"
          mode="outlined"
          onPress={toggleOnlineMode}
        >
          <Text style={styles.buttonText}>
            Turn {isOnline ? "offline" : "online"}
          </Text>
        </Button>
      </View>

      <View style={styles.metricsCard}>
        <Text style={styles.metricTitle}>Last measured grid mount</Text>
        <Text style={styles.metricText}>
          Expo Image : {formatDuration(lastRenderDuration)}
        </Text>
        <Text style={styles.metricNote}>
          This is a lightweight UI experiment based on first container layout,
          not a full native profiler benchmark.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Static preview</Text>
      <View style={styles.previewRow}>
        <PreviewCard title="Nitro Image">
          <NitroImage
            image={TEACHER_IMAGE}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </PreviewCard>
        <PreviewCard title="Nitro Image">
          <NitroImage
            image={STUDENT_IMAGE}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </PreviewCard>
      </View>

      <Text style={styles.sectionTitle}>Repeated grid benchmark</Text>
      <View key={runId} onLayout={captureBenchmarkLayout} style={styles.grid}>
        {benchmarkImages.map(({ id, imageSource }) => {
          return (
            <View key={id} style={styles.gridItem}>
              <NitroImage
                image={imageSource}
                style={styles.gridImage}
                resizeMode="contain"
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const PreviewCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <View style={styles.previewCard}>
      <Text style={styles.previewTitle}>{title}</Text>
      {children}
    </View>
  );
};

const formatDuration = (duration?: number) => {
  if (duration == null) {
    return "not measured yet";
  }

  return `${duration.toFixed(1)} ms`;
};

export default Test;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
    backgroundColor: "black",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  buttonText: {
    color: colors.text.primary,
  },
  metricsCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.background.overlay,
    gap: 8,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },
  metricText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  metricNote: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  previewRow: {
    flexDirection: "row",
    gap: 12,
  },
  previewCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    backgroundColor: colors.background.overlay,
    alignItems: "center",
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
  },
  previewImage: {
    width: 140,
    height: 140,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gridItem: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: colors.background.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
});
