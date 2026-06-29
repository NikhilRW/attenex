import { useAnimatedStyle } from "react-native-reanimated";
import { CUSTOM_TAB_BAR_WIDTH } from "../constants/ui";
import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { isFreshQuery } from "../utils/tanstack";
import { lectureService } from "@/features/Classes/services/lectureService";
import { StaleTime } from "../constants/tanstackConfig";
import { queryKeys } from "../constants/queryKeys";
import { BottomTabNavigationEventMap } from "node_modules/@react-navigation/bottom-tabs/lib/typescript/src/types";
import { NavigationHelpers, ParamListBase } from "@react-navigation/native";

export const useCustomTabBar = ({
  index,
  navigation,
  routeNames,
}: {
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  routeNames: string[];
  index: number;
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const role = user?.role;

  const handleTabPrefetch = useCallback(
    (routeName: string) => {
      if (routeName.includes("attendance") && role === "student") {
        const className = (user as any)?.className;
        if (!className) {
          return;
        }
        const studentLecturesQueryKey =
          queryKeys.lectures.studentByClass(className);

        const queryState = queryClient.getQueryState(studentLecturesQueryKey);
        const isDataFresh = isFreshQuery(
          queryState?.dataUpdatedAt,
          StaleTime.SECONDS_30,
        );

        if (!isDataFresh) {
          queryClient.prefetchQuery({
            queryKey: studentLecturesQueryKey,
            queryFn: async () => {
              const res = await lectureService.getStudentLectures(className);
              return res.success ? res.data || [] : [];
            },
            staleTime: StaleTime.SECONDS_30,
          });
        }
      }

      if (routeName.includes("classes") && role === "teacher") {
        const queryState = queryClient.getQueryState(queryKeys.classes.teacher);
        const isDataFresh = isFreshQuery(
          queryState?.dataUpdatedAt,
          StaleTime.SECONDS_30,
        );

        if (!isDataFresh) {
          queryClient.prefetchQuery({
            queryKey: queryKeys.classes.teacher,
            queryFn: async () => {
              const res = await lectureService.getTeacherClasses();
              return res.success ? [...res.data] : [];
            },
            staleTime: StaleTime.SECONDS_30,
          });
        }
      }
    },
    [queryClient, role, user],
  );

  const filteredRoutes = useMemo(() => {
    return routeNames
      .filter((name) => {
        if (!role) {
          return false;
        }

        if (!__DEV__ && name.includes("test")) {
          return false;
        }

        if (role && name.includes("role-selection")) {
          return false;
        }
        if (role === "student" && name.includes("classes")) {
          return false;
        }
        if (
          role === "teacher" &&
          (name.includes("attendance") ||
            name.includes("create-") ||
            name.includes("lecture-ended"))
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.includes("settings")) return 1;
        if (b.includes("settings")) return -1;
        return 0;
      });
  }, [role, routeNames]);

  const handleNavigate = useCallback(
    (routeName: string) => {
      navigation.navigate(routeName);
    },
    [navigation],
  );

  // Find the active tab index in the filtered routes
  const activeRouteName = routeNames[index];
  const activeFilteredIndex = useMemo(
    () => filteredRoutes.indexOf(activeRouteName),
    [activeRouteName, filteredRoutes],
  );

  const isEmptyTabBar = filteredRoutes.length === 0;

  const activatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      width: isEmptyTabBar ? 0 : CUSTOM_TAB_BAR_WIDTH,
      height: 60,
      left:
        activeFilteredIndex >= 0
          ? activeFilteredIndex * CUSTOM_TAB_BAR_WIDTH + 10
          : 10,
    };
  });
  return {
    filteredRoutes,
    handleNavigate,
    handleTabPrefetch,
    isEmptyTabBar,
    activatedBackgroundStyle,
    isAuthenticated,
    user
  };
};
