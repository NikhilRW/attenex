import { useCallback } from "react";

import { useFocusEffect } from "expo-router";

import { queryClient as qc, StaleTime } from "@/shared/constants/tanstackConfig";

export const useStaleLectureRefresh = ({
  queryKey,
  refreshLectures,
  shouldQueryBeEnabled,
}: {
  refreshLectures: () => void;
  queryKey: readonly string[];
  shouldQueryBeEnabled: boolean;
}) => {
  useFocusEffect(
    useCallback(() => {
      if (!shouldQueryBeEnabled) {
        return;
      }

      const updatedAt = qc.getQueryState(queryKey)?.dataUpdatedAt;
      const isStale = updatedAt == null || Date.now() - updatedAt >= StaleTime.SECONDS_30;

      if (isStale) {
        refreshLectures();
      }
    }, [queryKey, refreshLectures, shouldQueryBeEnabled]),
  );
};
