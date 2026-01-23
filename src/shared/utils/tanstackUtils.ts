/**
 * TanStack Query Utilities
 * Helper functions for working with queries and mutations
 */

import { QueryClient, QueryKey } from "@tanstack/react-query";

/**
 * Type-safe helper to get query data
 */
export const getQueryData = <TData = unknown>(
  queryClient: QueryClient,
  queryKey: QueryKey,
): TData | undefined => {
  return queryClient.getQueryData<TData>(queryKey);
};

/**
 * Type-safe helper to set query data
 */
export const setQueryData = <TData = unknown>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  data: TData | ((old: TData | undefined) => TData),
): void => {
  queryClient.setQueryData<TData>(queryKey, data);
};

/**
 * Invalidate multiple related queries
 * More efficient than individual invalidations
 */
export const invalidateRelatedQueries = async (
  queryClient: QueryClient,
  baseKey: readonly unknown[],
): Promise<void> => {
  await queryClient.invalidateQueries({
    queryKey: baseKey,
    exact: false, // Invalidate all queries that start with baseKey
  });
};

/**
 * Remove queries from cache
 * Useful for cleanup after logout or navigation
 */
export const removeQueries = (
  queryClient: QueryClient,
  queryKey: QueryKey,
): void => {
  queryClient.removeQueries({ queryKey });
};

/**
 * Cancel ongoing queries to prevent race conditions
 * Always call before optimistic updates
 */
export const cancelQueries = async (
  queryClient: QueryClient,
  queryKey: QueryKey,
): Promise<void> => {
  await queryClient.cancelQueries({ queryKey });
};

/**
 * Check if a query is currently fetching
 */
export const isQueryFetching = (
  queryClient: QueryClient,
  queryKey: QueryKey,
): boolean => {
  return queryClient.isFetching({ queryKey }) > 0;
};

/**
 * Check if a mutation is currently running
 */
export const isMutationPending = (
  queryClient: QueryClient,
  mutationKey: QueryKey,
): boolean => {
  return queryClient.isMutating({ mutationKey }) > 0;
};

/**
 * Prefetch query data for faster navigation
 * Use when you know user is likely to need data soon
 */
export const prefetchQuery = <TData = unknown>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  staleTime?: number,
): Promise<void> => {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime,
  });
};

/**
 * Ensure query data is available
 * Fetches if not in cache, returns cached data if available
 */
export const ensureQueryData = <TData = unknown>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
): Promise<TData> => {
  return queryClient.ensureQueryData({
    queryKey,
    queryFn,
  });
};

/**
 * Update query data after successful mutation
 * Common pattern for keeping UI in sync
 */
export const updateQueryDataAfterMutation = <TData = unknown, TItem = unknown>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  updater: (old: TData | undefined, newItem: TItem) => TData,
  newItem: TItem,
): void => {
  queryClient.setQueryData<TData>(queryKey, (old) => updater(old, newItem));
};

/**
 * Optimistic update with automatic rollback
 */
export const optimisticUpdate = async <TData = unknown>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  updater: (old: TData | undefined) => TData,
  mutationFn: () => Promise<unknown>,
): Promise<{ previousData: TData | undefined }> => {
  await cancelQueries(queryClient, queryKey);

  const previousData = getQueryData<TData>(queryClient, queryKey);

  setQueryData(queryClient, queryKey, updater);

  try {
    await mutationFn();
    return { previousData };
  } catch (error) {
    setQueryData(queryClient, queryKey, previousData as TData);
    throw error;
  }
};

/**
 * Batch invalidate multiple query keys
 */
export const batchInvalidateQueries = async (
  queryClient: QueryClient,
  queryKeys: QueryKey[],
): Promise<void> => {
  await Promise.all(
    queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  );
};

/**
 * Reset queries to initial state
 * Useful for feature-specific resets
 */
export const resetQueries = async (
  queryClient: QueryClient,
  queryKey: QueryKey,
): Promise<void> => {
  await queryClient.resetQueries({ queryKey });
};

/**
 * Get query state for debugging
 */
export const getQueryState = (queryClient: QueryClient, queryKey: QueryKey) => {
  const state = queryClient.getQueryState(queryKey);
  return {
    status: state?.status,
    fetchStatus: state?.fetchStatus,
    error: state?.error,
    dataUpdatedAt: state?.dataUpdatedAt,
    errorUpdatedAt: state?.errorUpdatedAt,
  };
};
