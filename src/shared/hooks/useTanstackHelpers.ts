// TODO: use this in one by one in our codebase

// /**
//  * TanStack Query Custom Hooks
//  * Reusable hooks for common query patterns
//  */

// import { QueryKey, useQueryClient } from "@tanstack/react-query";
// import { useCallback, useEffect, useRef } from "react";

// /**
//  * Hook to prefetch data for faster navigation
//  * Use this when you know the user is likely to navigate to a screen
//  *
//  * @example
//  * ```tsx
//  * const prefetchLectureDetails = usePrefetch();
//  *
//  * <Button onPress={() => {
//  *   prefetchLectureDetails(
//  *     queryKeys.lectures.detail(lectureId),
//  *     () => lectureService.getLectureDetails(lectureId)
//  *   );
//  *   router.push(`/lectures/${lectureId}`);
//  * }}>
//  * ```
//  */
// export const usePrefetch = () => {
//   const queryClient = useQueryClient();

//   return useCallback(
//     <T>(queryKey: QueryKey, queryFn: () => Promise<T>) => {
//       queryClient.prefetchQuery({
//         queryKey,
//         queryFn,
//       });
//     },
//     [queryClient],
//   );
// };

// /**
//  * Hook to invalidate queries with optional filtering
//  * Useful for refreshing data after mutations
//  *
//  * @example
//  * ```tsx
//  * const invalidate = useInvalidateQueries();
//  *
//  * await createLecture();
//  * invalidate(queryKeys.lectures.teacher());
//  * ```
//  */
// export const useInvalidateQueries = () => {
//   const queryClient = useQueryClient();

//   return useCallback(
//     (queryKey: QueryKey) => {
//       return queryClient.invalidateQueries({ queryKey });
//     },
//     [queryClient],
//   );
// };

// /**
//  * Hook for optimistic updates pattern
//  * Automatically handles rollback on error
//  *
//  * @example
//  * ```tsx
//  * const { optimisticUpdate } = useOptimisticUpdate();
//  *
//  * optimisticUpdate(
//  *   queryKeys.lectures.teacher(),
//  *   (old) => [...old, newLecture],
//  *   () => lectureService.createLecture(data)
//  * );
//  * ```
//  */
// export const useOptimisticUpdate = <TData = unknown>() => {
//   const queryClient = useQueryClient();

//   const optimisticUpdate = useCallback(
//     async (
//       queryKey: QueryKey,
//       updater: (old: TData | undefined) => TData,
//       mutationFn: () => Promise<unknown>,
//     ) => {
//       await queryClient.cancelQueries({ queryKey });

//       const previousData = queryClient.getQueryData<TData>(queryKey);

//       queryClient.setQueryData<TData>(queryKey, updater);

//       try {
//         await mutationFn();
//         return { previousData };
//       } catch (error) {
//         queryClient.setQueryData(queryKey, previousData);
//         throw error;
//       }
//     },
//     [queryClient],
//   );

//   return { optimisticUpdate };
// };

// /**
//  * Hook to get cached data without triggering a fetch
//  * Useful for accessing data that should already be cached
//  *
//  * @example
//  * ```tsx
//  * const getCachedLecture = useCachedQuery();
//  * const lecture = getCachedLecture(queryKeys.lectures.detail(id));
//  * ```
//  */
// export const useCachedQuery = <TData = unknown>() => {
//   const queryClient = useQueryClient();

//   return useCallback(
//     (queryKey: QueryKey): TData | undefined => {
//       return queryClient.getQueryData<TData>(queryKey);
//     },
//     [queryClient],
//   );
// };

// /**
//  * Hook to batch multiple query invalidations
//  * More efficient than calling invalidate multiple times
//  *
//  * @example
//  * ```tsx
//  * const batchInvalidate = useBatchInvalidate();
//  *
//  * await createLecture();
//  * batchInvalidate([
//  *   queryKeys.lectures.teacher(),
//  *   queryKeys.classes.teacher(),
//  * ]);
//  * ```
//  */
// export const useBatchInvalidate = () => {
//   const queryClient = useQueryClient();

//   return useCallback(
//     async (queryKeys: QueryKey[]) => {
//       await Promise.all(
//         queryKeys.map((queryKey) =>
//           queryClient.invalidateQueries({ queryKey }),
//         ),
//       );
//     },
//     [queryClient],
//   );
// };

// /**
//  * Hook to debounce query refetching
//  * Prevents excessive API calls during rapid user input
//  *
//  * @example
//  * ```tsx
//  * const debouncedRefetch = useDebounceRefetch(refetch, 500);
//  *
//  * <TextInput onChangeText={(text) => {
//  *   setSearchQuery(text);
//  *   debouncedRefetch();
//  * }} />
//  * ```
//  */
// export const useDebounceRefetch = (
//   refetchFn: () => void,
//   delay: number = 300,
// ) => {
//   const timeoutRef = useRef<NodeJS.Timeout>();

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []);

//   return useCallback(() => {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }

//     timeoutRef.current = setTimeout(() => {
//       refetchFn();
//     }, delay);
//   }, [refetchFn, delay]);
// };

// /**
//  * Hook to reset all queries (useful for logout)
//  *
//  * @example
//  * ```tsx
//  * const resetAllQueries = useResetQueries();
//  *
//  * const handleLogout = async () => {
//  *   await logout();
//  *   resetAllQueries();
//  *   router.replace('/login');
//  * };
//  * ```
//  */
// export const useResetQueries = () => {
//   const queryClient = useQueryClient();

//   return useCallback(() => {
//     queryClient.clear();
//   }, [queryClient]);
// };

// /**
//  * Hook for polling queries with start/stop control
//  * Useful for real-time data that needs periodic updates
//  *
//  * @example
//  * ```tsx
//  * const { startPolling, stopPolling } = usePolling(
//  *   refetch,
//  *   5000 // Poll every 5 seconds
//  * );
//  *
//  * useEffect(() => {
//  *   startPolling();
//  *   return () => stopPolling();
//  * }, []);
//  * ```
//  */
// export const usePolling = (refetchFn: () => void, interval: number) => {
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   const startPolling = useCallback(() => {
//     if (intervalRef.current) return;

//     intervalRef.current = setInterval(() => {
//       refetchFn();
//     }, interval);
//   }, [refetchFn, interval]);

//   const stopPolling = useCallback(() => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = undefined;
//     }
//   }, []);

//   useEffect(() => {
//     return () => stopPolling();
//   }, [stopPolling]);

//   return { startPolling, stopPolling };
// };
