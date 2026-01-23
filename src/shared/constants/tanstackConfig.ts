import { logger } from "@shared/utils/logger";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

export enum StaleTime {
  SECONDS_3 = 3000,
  SECONDS_7 = 7000,
  SECONDS_15 = 15000,
  SECONDS_25 = 25000,
  SECONDS_30 = 30000,
  MINUTES_2 = 120000,
  MINUTES_5 = 300000,
  DAYS_1 = 86400000,
  DAYS_5 = 432000000,
  INFINITE = Infinity,
}

export enum GarbageTime {
  SECONDS_7 = 7000,
  SECONDS_15 = 15000,
  SECONDS_25 = 25000,
  SECONDS_30 = 30000,
  MINUTES_5 = 300000,
  MINUTES_10 = 600000,
  MINUTES_30 = 1800000,
}

const queryCache = new QueryCache({
  onError: (error, query) => {
    logger.error(`Query error [${query.queryHash}]:`, error);
  },
  onSuccess: (_, query) => {
    if (__DEV__) {
      logger.debug(`Query success [${query.queryHash}]`);
    }
  },
});

const mutationCache = new MutationCache({
  onError: (error, _variables, _context, mutation) => {
    logger.error(`Mutation error [${mutation.options.mutationKey}]:`, error);
  },
  onSuccess: (_data, _variables, _context, mutation) => {
    if (__DEV__) {
      logger.debug(`Mutation success [${mutation.options.mutationKey}]`);
    }
  },
});

export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      staleTime: StaleTime.MINUTES_5,
      gcTime: GarbageTime.MINUTES_10,
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 404) return false;
        if (error?.response?.status === 401) return false;
        if (error?.response?.status === 403) return false;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 400) return false;
        if (error?.response?.status === 404) return false;
        if (error?.response?.status === 401) return false;
        return failureCount < 1;
      },
      retryDelay: 1000,
    },
  },
});
