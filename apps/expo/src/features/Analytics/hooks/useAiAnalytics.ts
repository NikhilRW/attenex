import { useCallback, useRef, useState } from "react";

import { TextDecoder } from "react-native-nitro-text-decoder";

import { logger } from "@/shared/utils/logger";

import { AnalyticsService } from "../services/AnalyticsService";
import { GetAiAnalyticsQueryParamsType } from "../types/common";
import { buildQueryParamsForTeacherAnalytics } from "../utils/common";

export const useAiAnalytics = ({
  startDate,
  endDate,
  subjectId,
}: GetAiAnalyticsQueryParamsType) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const decoder = useRef(new TextDecoder());

  const clearAnalysis = useCallback(() => {
    setText("");
    setError(null);
  }, []);

  const fetchAnalysis = useCallback(async () => {
    setText("");
    setError(null);
    setIsLoading(true);

    try {
      const params = buildQueryParamsForTeacherAnalytics({ startDate, endDate, subjectId });
      const response = await AnalyticsService.getAiAnalytics(params);

      if (!response.ok) {
        throw new Error(`AI analytics request failed with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("AI analytics response did not include a readable stream");
      }

      let receivedContent = false;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.current.decode(value, { stream: true });
        if (chunk.length > 0) {
          receivedContent = true;
          setText((previousText) => previousText + chunk);
        }
      }

      const remainingText = decoder.current.decode();
      if (remainingText.length > 0) {
        receivedContent = true;
        setText((previousText) => previousText + remainingText);
      }

      if (!receivedContent) {
        throw new Error("AI analytics stream completed without content");
      }
    } catch (caughtError) {
      logger.error("Error while fetching AI analytics", caughtError);
      setError("Failed to load AI analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [endDate, startDate, subjectId]);

  return { text, isLoading, error, fetchAnalysis, clearAnalysis };
};
