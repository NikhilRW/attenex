import { queryKeys } from "@/shared/constants/queryKeys";
import { useAuthStore } from "@/shared/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Lecture } from "../types/common";

export const useLectureOngoingScreen = () => {
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ lectureId: string }>();
  const user = useAuthStore((state) => state.user);
  const joinedLecture = queryClient
    .getQueryData<
      Lecture[]
    >(queryKeys.lectures.studentByClass(user?.className || ""))
    ?.find((lecture) => lecture.id === params.lectureId);
  return {
    joinedLecture,
  };
};
