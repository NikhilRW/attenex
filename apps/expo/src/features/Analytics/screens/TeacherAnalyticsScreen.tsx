import { useCallback, useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useQueryClient } from "@tanstack/react-query";
import { TextDecoder } from "react-native-nitro-text-decoder";

import { FuturisticBackground } from "@/shared/components/FuturisticBackground";
import { queryKeys } from "@/shared/constants/queryKeys";
import { logger } from "@/shared/utils/logger";
import { showMessage } from "@/shared/utils/toasts";

import AiAnalysisCard from "../components/AiAnalysisCard";
import AiFavButton from "../components/AiFavButton";
import AnalyticsGraph from "../components/AnalyticsGraph";
import AnalyticsScreenHeader from "../components/AnalyticsScreenHeader";
import CustomDateBottomSheet from "../components/CustomDateBottomSheet";
import DateFilters from "../components/DateFilters";
import { SubjectSelectorWrapper } from "../components/SubjectSelectorWrapper";
import { useAnalyticsQuery } from "../hooks/useAnalyticsQuery";
import { AnalyticsService } from "../services/AnalyticsService";
import { styles } from "../styles/TeacherAnalyticsScreen.styles";
import { DateFilterType } from "../types/common";
import {
  buildQueryParamsForTeacherAnalytics,
  getAnalyticsGraphPoints,
  getCurrentDate,
  getNormalizedDate,
  getStartDateBasedOnFilter,
} from "../utils/common";

const TeacherAnalyticsScreen = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilterType>("7d");
  const [isCustomDateFilterApplied, setIsCustomDateFilterApplied] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [text, setText] = useState("");
  const [isAiAnalysisLoading, setIsAiAnalysisLoading] = useState(false);
  const decoder = useRef(new TextDecoder());
  const qc = useQueryClient();

  const startDate = useMemo(() => {
    if (selectedDateFilter === "custom" && customStartDate && isCustomDateFilterApplied) {
      return getNormalizedDate(customStartDate);
    }
    const date = getStartDateBasedOnFilter(getCurrentDate(), selectedDateFilter);
    return getNormalizedDate(date);
  }, [selectedDateFilter, customStartDate, isCustomDateFilterApplied]);

  const trueSheetRef = useRef<TrueSheet>(null);

  const endDate = useMemo(() => {
    if (selectedDateFilter === "custom" && customEndDate && isCustomDateFilterApplied) {
      return getNormalizedDate(customEndDate);
    }
    return getNormalizedDate(getCurrentDate());
  }, [selectedDateFilter, customEndDate, isCustomDateFilterApplied]);

  const resetDateValues = useCallback(() => {
    setCustomEndDate(null);
    setCustomStartDate(null);
  }, []);

  const { data, isPending: isLoading } = useAnalyticsQuery({
    subjectId: selectedSubject || undefined,
    startDate,
    endDate,
    selectedDateFilter,
  });

  const graphPoints = useMemo(() => {
    return getAnalyticsGraphPoints(data);
  }, [data]);

  const openDateFilterSheet = useCallback(() => {
    setIsCustomDateFilterApplied(false);
    resetDateValues();
    trueSheetRef.current?.present();
  }, [resetDateValues]);

  const applyDateFilter = useCallback(() => {
    if (customEndDate === null || customStartDate === null) {
      showMessage({
        description: "Start and End date cannot be empty.",
        type: "danger",
        message: "Invalid Date Range",
      });
      return;
    }
    if (customEndDate.getTime() < customStartDate.getTime()) {
      showMessage({
        description: "End date cannot be earlier than start date.",
        type: "danger",
        message: "Invalid Date Range",
      });
      return;
    }
    trueSheetRef.current?.dismiss();
    setIsCustomDateFilterApplied(true);
    qc.invalidateQueries({ queryKey: queryKeys.analytics.teacher.all });
  }, [customEndDate, customStartDate, qc]);

  const append = useCallback((text: string) => {
    setText((prev) => prev + text);
  }, []);

  // TODO: create a beautiful hook
  const handleAiAnalyticsPress = useCallback(async () => {
    // add params
    setText("");
    const params = buildQueryParamsForTeacherAnalytics({
      startDate,
      subjectId: selectedSubject,
      endDate,
    });
    setIsAiAnalysisLoading(true);
    try {
      const res = await AnalyticsService.getAiAnalytics(params);
      const reader = res.body?.getReader();
      if (!reader) {
        append("No readable stream!");
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.current.decode(value, { stream: true });
        append(text);
      }
    } catch (error) {
      logger.info(error + " Error while fetching AI analytics");
    } finally {
      setIsAiAnalysisLoading(false);
    }
  }, [append, startDate, selectedSubject, endDate]);

  const dateFilterOnChangeWrapper = useCallback((filter: DateFilterType) => {
    setSelectedDateFilter(filter);
    setText("");
  }, []);

  return (
    <View style={styles.container}>
      <FuturisticBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AnalyticsScreenHeader />
        <SubjectSelectorWrapper
          selectedSubject={selectedSubject || ""}
          onSelectSubject={setSelectedSubject}
        />
        <DateFilters
          onSelectFilter={dateFilterOnChangeWrapper}
          selectedFilter={selectedDateFilter}
          openDateFilterSheet={openDateFilterSheet}
        />

        <AnalyticsGraph points={graphPoints} isLoading={isLoading} />
        <AiAnalysisCard text={text} isLoading={isAiAnalysisLoading} />
      </ScrollView>
      <CustomDateBottomSheet
        ref={trueSheetRef}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        setCustomStartDate={setCustomStartDate}
        setCustomEndDate={setCustomEndDate}
        applyDateFilter={applyDateFilter}
      />
      <AiFavButton onPress={handleAiAnalyticsPress} />
    </View>
  );
};

export default TeacherAnalyticsScreen;
