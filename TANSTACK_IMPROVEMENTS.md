# TanStack Query Implementation Guide

## 📊 Overview

Comprehensive improvements to TanStack Query (React Query) implementation following best practices from the official documentation and community standards.

## ✅ What Was Improved

### 1. **Query Client Configuration** (tanstackConfig.ts)

**Before:**
```typescript
export const queryClient = new QueryClient();
```

**After:**
```typescript
export const queryClient = new QueryClient({
  queryCache, // With error/success logging
  mutationCache, // With error/success logging
  defaultOptions: {
    queries: {
      staleTime: 5 minutes,
      gcTime: 10 minutes,
      retry: Smart retry logic,
      retryDelay: Exponential backoff,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1 attempt for non-4xx errors,
    },
  },
});
```

**Benefits:**
- ✅ Automatic error logging in dev
- ✅ Smart retry for network failures
- ✅ Exponential backoff prevents server overload
- ✅ No retry for 4xx client errors
- ✅ Better cache management

### 2. **Query Keys Structure** (queryKeys.ts)

**Before - Flat structure:**
```typescript
export const queryKeys = {
  resetPassword: ["reset-password"],
  verifyEmail: ["verify-email"],
  teacherLectures: ["teacher-lectures"],
  // ...
};
```

**After - Hierarchical domain-based structure:**
```typescript
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    // Static keys - direct constants (no function wrapper)
    linkedin: ["auth", "linkedin"] as const,
    forgotPassword: ["auth", "forgot-password"] as const,
    
    // Dynamic keys - functions for parameters
    verifyEmail: (token?: string) => 
      token ? ["auth", "verify-email", token] : ["auth", "verify-email"],
    resetPassword: (token?: string) => 
      token ? ["auth", "reset-password", token] : ["auth", "reset-password"],
  },
  lectures: {
    all: ["lectures"] as const,
    // Static keys
    teacher: ["lectures", "teacher"] as const,
    student: ["lectures", "student"] as const,
    
    // Dynamic keys with parameters
    detail: (id: string) => ["lectures", "detail", id] as const,
    passcode: (id: string) => ["lectures", "passcode", id] as const,
  },
};
```

**Key Simplification Benefits:**
- ✅ **Static keys as constants** - No unnecessary function wrappers for keys without parameters
- ✅ **Functions only for parameters** - Use functions only when building dynamic keys
- ✅ **Better performance** - Avoid function call overhead for static keys
- ✅ **Simpler code** - Direct access: `queryKeys.lectures.teacher` vs `queryKeys.lectures.teacher()`
- ✅ **Type-safe with TypeScript**
- ✅ **Easy invalidation** - `invalidate(queryKeys.lectures.all)` invalidates all lecture queries
- ✅ **Clear hierarchy** - Organized by domain
- ✅ **Follows [TKDodo's best practices](https://tkdodo.eu/blog/effective-react-query-keys)**

### 3. **Mutation Keys Structure** (mutationKeys.ts)

**Before:**
```typescript
export const mutationKeys = {
  createLecture: ["create-lecture"],
  updateLectureByTeacher: ["update-lecuture-by-teacher"], // typo
};
```

**After:**
```typescript
export const mutationKeys = {
  lectures: {
    create: ["lectures", "create"] as const,
    update: ["lectures", "update"] as const,
  },
};
```

**Benefits:**
- ✅ Organized by domain
- ✅ Consistent naming
- ✅ Fixed typos
- ✅ Better for filtering and tracking

### 4. **Custom Hooks** (useTanstackHelpers.ts)

New reusable hooks for common patterns:

#### `usePrefetch()`
Prefetch data before navigation for instant loading:
```typescript
const prefetch = usePrefetch();

<Button onPress={() => {
  prefetch(
    queryKeys.lectures.detail(id),
    () => lectureService.getDetails(id)
  );
  router.push(`/lectures/${id}`);
}}>
```

#### `useInvalidateQueries()`
Type-safe query invalidation:
```typescript
const invalidate = useInvalidateQueries();

await createLecture();
invalidate(queryKeys.lectures.teacher());
```

#### `useOptimisticUpdate()`
Automatic rollback on error:
```typescript
const { optimisticUpdate } = useOptimisticUpdate();

optimisticUpdate(
  queryKeys.lectures.teacher(),
  (old) => [...old, newLecture],
  () => lectureService.create(data)
);
```

#### `useBatchInvalidate()`
Invalidate multiple queries efficiently:
```typescript
const batchInvalidate = useBatchInvalidate();

await updateProfile();
batchInvalidate([
  queryKeys.auth.all,
  queryKeys.user.profile(),
]);
```

#### `useDebounceRefetch()`
Prevent excessive API calls during typing:
```typescript
const debouncedRefetch = useDebounceRefetch(refetch, 500);

<TextInput onChangeText={(text) => {
  setSearchQuery(text);
  debouncedRefetch();
}} />
```

#### `usePolling()`
Controlled polling with start/stop:
```typescript
const { startPolling, stopPolling } = usePolling(refetch, 5000);

useEffect(() => {
  startPolling();
  return () => stopPolling();
}, []);
```

### 5. **Socket Integration** (useSocketQuery.ts)

New pattern for real-time updates with automatic query invalidation:

#### `useSocketQuery()`
Generic socket integration:
```typescript
useSocketQuery({
  queryKey: queryKeys.lectures.teacher(),
  roomId: lectureId,
  events: [
    {
      event: 'student-joined',
      handler: (data) => console.log(data)
    }
  ],
  reconnectOnForeground: true,
});
```

#### `useLectureSocket()`
Simplified for lectures:
```typescript
useLectureSocket({
  lectureId,
  queryKey: queryKeys.attendance.teacher(lectureId),
  onStudentJoined: (data) => console.log(data),
  enabled: isScreenFocused,
});
```

#### `useMultipleLecturesSockets()`
For teacher dashboard with multiple rooms:
```typescript
useMultipleLecturesSockets({
  lectures: activeLectures,
  queryKey: queryKeys.lectures.teacher(),
});
```

**Benefits:**
- ✅ Automatic socket lifecycle management
- ✅ Auto-reconnect on app foreground
- ✅ Automatic cleanup on unmount
- ✅ Query invalidation on socket events
- ✅ No manual socket management needed

### 6. **Utility Functions** (tanstackUtils.ts)

Type-safe utility functions:

```typescript
// Optimistic update with rollback
await optimisticUpdate(
  queryClient,
  queryKeys.lectures.teacher(),
  (old) => [...old, newLecture],
  () => lectureService.create(data)
);

// Batch invalidations
await batchInvalidateQueries(queryClient, [
  queryKeys.lectures.all,
  queryKeys.classes.all,
]);

// Prefetch for navigation
await prefetchQuery(
  queryClient,
  queryKeys.lectures.detail(id),
  () => lectureService.getDetails(id)
);

// Get cached data
const lecture = getQueryData(queryClient, queryKeys.lectures.detail(id));
```

## 🔄 Migration Guide

### Using New Query Keys

**Old:**
```typescript
// ❌ Old flat structure
const { data } = useQuery({
  queryKey: queryKeys.teacherLectures,
  queryFn: fetchLectures,
});
```

**New (Backward Compatible):**
```typescript
// ✅ Option 1: Use legacy alias (no changes needed)
const { data } = useQuery({
  queryKey: queryKeys.teacherLectures, // Still works via legacyQueryKeys
  queryFn: fetchLectures,
});

// ✅ Option 2: Migrate to new structure (recommended)
const { data } = useQuery({
  queryKey: queryKeys.lectures.teacher(),
  queryFn: fetchLectures,
});
```

### Using New Mutation Keys

**Old:**
```typescript
// ❌ Old structure
const { mutate } = useMutation({
  mutationKey: mutationKeys.createLecture,
  mutationFn: createLecture,
});
```

**New (Backward Compatible):**
```typescript
// ✅ Option 1: Use legacy alias
const { mutate } = useMutation({
  mutationKey: mutationKeys.createLecture, // Still works
  mutationFn: createLecture,
});

// ✅ Option 2: Migrate (recommended)
const { mutate } = useMutation({
  mutationKey: mutationKeys.lectures.create,
  mutationFn: createLecture,
});
```

### Replacing Socket Patterns

**Old (Manual Management):**
```typescript
// ❌ Lots of boilerplate
useEffect(() => {
  socketService.connect();
  socketService.joinLecture(lectureId);
  
  const handler = (data) => {
    if (data.lectureId === lectureId) {
      refetch();
    }
  };
  
  socketService.onStudentJoined(handler);
  
  const appStateListener = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      // reconnect logic...
    }
  });
  
  return () => {
    socketService.leaveLecture(lectureId);
    socketService.offStudentJoined();
    appStateListener.remove();
  };
}, [lectureId]);
```

**New (Declarative):**
```typescript
// ✅ Clean and simple
useLectureSocket({
  lectureId,
  queryKey: queryKeys.attendance.teacher(lectureId),
  onStudentJoined: (data) => console.log(data),
});
```

## 📝 Best Practices

### 1. **Always Use Query Key Factories**

```typescript
// ✅ Good - Can invalidate all lecture queries
queryKeys.lectures.all

// ✅ Good - Can invalidate specific lecture
queryKeys.lectures.detail(lectureId)

// ❌ Bad - Hard to invalidate related queries
["lecture", lectureId]
```

### 2. **Leverage Stale Time**

```typescript
// ✅ User profile rarely changes
useQuery({
  queryKey: queryKeys.user.profile(),
  queryFn: fetchProfile,
  staleTime: StaleTime.MINUTES_5, // Don't refetch for 5 mins
});

// ✅ Realtime attendance changes frequently
useQuery({
  queryKey: queryKeys.attendance.byLecture(id),
  queryFn: fetchAttendance,
  staleTime: 0, // Always refetch
});
```

### 3. **Use Optimistic Updates**

```typescript
// ✅ Instant UI update, rollback on error
const { mutate } = useMutation({
  mutationFn: createLecture,
  onMutate: async (newLecture) => {
    await queryClient.cancelQueries(queryKeys.lectures.teacher());
    
    const previous = queryClient.getQueryData(queryKeys.lectures.teacher());
    
    queryClient.setQueryData(queryKeys.lectures.teacher(), (old) => 
      [...old, newLecture]
    );
    
    return { previous };
  },
  onError: (err, newLecture, context) => {
    queryClient.setQueryData(queryKeys.lectures.teacher(), context.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries(queryKeys.lectures.teacher());
  },
});
```

### 4. **Invalidate Hierarchically**

```typescript
// ✅ Invalidate all auth queries
queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

// ✅ Invalidate all lecture queries
queryClient.invalidateQueries({ queryKey: queryKeys.lectures.all });

// ✅ Invalidate specific lecture
queryClient.invalidateQueries({ queryKey: queryKeys.lectures.detail(id) });
```

### 5. **Use Enabled Flag for Conditional Queries**

```typescript
// ✅ Only fetch when user is logged in
const { data } = useQuery({
  queryKey: queryKeys.user.profile(),
  queryFn: fetchProfile,
  enabled: !!user,
});

// ✅ Only fetch when lectureId exists
const { data } = useQuery({
  queryKey: queryKeys.lectures.detail(lectureId),
  queryFn: () => fetchLecture(lectureId),
  enabled: !!lectureId,
});
```

## 🐛 Common Issues Fixed

### Issue 1: useQuery as Side Effect (Anti-pattern)

**❌ Before:**
```typescript
useQuery({
  queryFn: () => {
    // Socket setup as side effect in queryFn
    socketService.connect();
    return "data";
  },
  queryKey: queryKeys.socketAttendanceViewTeacher,
});
```

**✅ After:**
```typescript
useLectureSocket({
  lectureId,
  queryKey: queryKeys.attendance.teacher(lectureId),
});
```

### Issue 2: Missing Dependencies

**❌ Before:**
```typescript
useEffect(() => {
  refetch();
}, []); // Missing dependencies
```

**✅ After:**
```typescript
useFocusEffect(
  useCallback(() => {
    refetch();
  }, [refetch]) // Proper dependencies
);
```

### Issue 3: Race Conditions

**❌ Before:**
```typescript
const handleUpdate = async () => {
  await updateLecture();
  refetch(); // Old data might come back
};
```

**✅ After:**
```typescript
const handleUpdate = async () => {
  await queryClient.cancelQueries(queryKeys.lectures.detail(id));
  await updateLecture();
  await queryClient.invalidateQueries(queryKeys.lectures.detail(id));
};
```

## 📚 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)

## 🎯 Next Steps

1. ✅ **Migrate existing hooks gradually** - Use legacy aliases for now
2. ✅ **Replace manual socket management** - Use `useSocketQuery` hooks
3. ✅ **Add optimistic updates** - For better UX in mutations
4. ✅ **Implement prefetching** - For instant navigation
5. ✅ **Monitor query cache** - Use React Query Devtools

## 🔧 Files Modified

- ✅ `src/shared/constants/tanstackConfig.ts` - Enhanced configuration
- ✅ `src/shared/constants/queryKeys.ts` - Hierarchical structure
- ✅ `src/shared/constants/mutationKeys.ts` - Domain organization
- ✅ `src/shared/hooks/useTanstackHelpers.ts` - Custom hooks
- ✅ `src/shared/hooks/useSocketQuery.ts` - Socket integration
- ✅ `src/shared/utils/tanstackUtils.ts` - Utility functions

All changes are **backward compatible** via legacy aliases!
