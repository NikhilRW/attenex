/**
 * Performance monitoring utilities for React Native
 * Based on React Native best practices for FPS and TTI measurement
 */

export const markPerformance = (markName: string) => {
  if (__DEV__) {
    console.log(`[Performance] Mark: ${markName} at ${Date.now()}`);
  }
};

export const logRenderTime = (
  componentName: string,
  phase: "mount" | "update",
  actualDuration: number,
) => {
  if (__DEV__ && actualDuration > 16) {
    console.warn(
      `[Performance] ${componentName} ${phase} took ${actualDuration.toFixed(2)}ms`,
    );
  }
};

export const createLeakDetector = (name: string) => {
  let isActive = true;

  const check = () => {
    if (!isActive && __DEV__) {
      console.error(`[Memory Leak] ${name} callback invoked after cleanup`);
    }
  };

  const cleanup = () => {
    isActive = false;
  };

  return { check, cleanup };
};

export const profileFunction = async <T>(
  name: string,
  fn: () => T | Promise<T>,
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;

    if (__DEV__ && duration > 100) {
      console.warn(`[Performance] ${name} took ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(
      `[Performance] ${name} failed after ${duration.toFixed(2)}ms`,
      error,
    );
    throw error;
  }
};

/**
 * =============================================================================
 * DOCUMENTATION & USAGE GUIDE
 * =============================================================================
 *
 * FPS MONITORING:
 * - Use React DevTools for accurate measurement
 * - Open React DevTools by pressing 'j' in Metro, or shake device → "Open DevTools"
 * - For programmatic FPS tracking, consider using:
 *   • react-native-performance for TTI markers
 *   • React DevTools Profiler for component render tracking
 *
 * markPerformance(markName: string):
 * - Mark Time-to-Interactive (TTI) for critical user flows
 * - Use with react-native-performance library for production apps
 * - Example:
 *   performance.mark('app-mount-start');
 *   // ... app initialization
 *   performance.mark('app-mount-end');
 *   performance.measure('app-mount', 'app-mount-start', 'app-mount-end');
 *
 * deferWork(callback: () => void):
 * - Defer non-critical work until interactions complete
 * - Critical for optimizing TTI (Time-to-Interactive)
 * - Returns cancellable promise
 * - Example:
 *   deferWork(() => {
 *     // Load analytics
 *     // Prefetch data
 *     // Initialize non-critical services
 *   });
 *
 * logRenderTime(componentName: string, phase: 'mount' | 'update', actualDuration: number):
 * - Log render performance in development
 * - Use React Profiler API for production measurements
 * - Logs renders taking more than 16ms (60fps threshold)
 *
 * createLeakDetector(name: string):
 * - Memory leak detection helper
 * - Use in useEffect cleanup to verify subscriptions are cleaned up
 *
 * profileFunction(name: string, fn: () => T | Promise<T>):
 * - Profile a function's execution time
 * - Useful for identifying expensive operations
 * - Logs warnings for operations taking more than 100ms
 *
 * STATE BATCHING:
 * - Batch multiple state updates to prevent excessive re-renders
 * - Use with React 18's automatic batching or wrap in startTransition
 * - Example:
 *   import { startTransition } from 'react';
 *   startTransition(() => {
 *     setFilter('present');
 *     setSearchQuery('');
 *     setSortOrder('asc');
 *   });
 *
 * RECOMMENDED PATTERNS FOR PERFORMANCE OPTIMIZATION:
 *
 * 1. Lists: Use FlashList instead of FlatList/ScrollView
 *    - npm install @shopify/flash-list
 *    - 10x better performance for large lists
 *
 * 2. Re-renders: Use React Compiler (automatic memoization)
 *    - Enable in babel.config.js
 *    - Or manually use useMemo/useCallback
 *
 * 3. State: Use atomic state (Jotai/Zustand)
 *    - Already using Zustand ✓
 *    - Keep state granular to minimize re-renders
 *
 * 4. Animations: Use Reanimated worklets
 *    - Already configured ✓
 *    - Keep animations on UI thread
 *
 * 5. Images: Use expo-image for better caching
 *    - Already using expo-image ✓
 *
 * 6. Bundle: Avoid barrel exports
 *    - Import directly: import { Button } from './components/Button'
 *    - Not: import { Button } from './components'
 */
