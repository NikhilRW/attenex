import { QueryClient } from "@tanstack/react-query";

export enum StaleTime {
  SECONDS_3 = 3000,
  SECONDS_7 = 7000,
  SECONDS_15 = 15000,
  SECONDS_25 = 25000,
  SECONDS_30 = 30000,
  MINUTES_2 = 120000,
  DAYS_5 = 1000 * 86400 * 5,
}

export enum GarbageTime {
  SECONDS_7 = 7000,
  SECONDS_15 = 15000,
  SECONDS_25 = 25000,
  SECONDS_30 = 30000,
}

export const queryClient = new QueryClient();
