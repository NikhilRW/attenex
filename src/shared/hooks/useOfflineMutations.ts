import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { mutationKeys } from "../constants/mutationKeys";
import {
  createLectureMutateFn,
  createNewClassMutateFn,
  deleteLectureMutateFn,
  nameUpdateMutateFn,
  roleUpdateMutateFn,
  updateLectureMutateFn,
} from "../utils/offlineMutationFuncs";
import { defaultFaliureCount } from "../utils/tanstack";
import { queryKeys } from "../constants/queryKeys";
import { sendVerificationEmailRequest } from "@/features/Auth/utils/email";

export const useOfflineMutations = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    /**
     * For making the name update feature offline first.
     */
    queryClient.setMutationDefaults(mutationKeys.user.updateName, {
      mutationFn: nameUpdateMutateFn,
      networkMode: "online",
      gcTime: Infinity,
      retry: 3,
      retryDelay: defaultFaliureCount,
    });

    /**
     * For making the role update feature offline first.
     */
    queryClient.setMutationDefaults(mutationKeys.user.updateRole, {
      mutationFn: roleUpdateMutateFn,
      networkMode: "online",
      gcTime: Infinity,
      retry: 3,
      retryDelay: defaultFaliureCount,
    });

    /**
     * For able to add new class in an offline first way.
     */
    queryClient.setMutationDefaults(mutationKeys.classes.create, {
      mutationFn: createNewClassMutateFn,
      gcTime: Infinity,
      retry: 1,
      retryDelay: defaultFaliureCount,
    });

    /**
     * For being able to add new lecture in an offline first way.
     */
    queryClient.setMutationDefaults(mutationKeys.lectures.create, {
      mutationFn: createLectureMutateFn,
      networkMode: "online",
      gcTime: Infinity,
      retry: 1,
      retryDelay: defaultFaliureCount,
    });

    /**
     * For being able to delete lecture in an offline first way.
     */
    queryClient.setMutationDefaults(mutationKeys.lectures.delete, {
      mutationFn: deleteLectureMutateFn,
      networkMode: "online",
      gcTime: Infinity,
      retry: 1,
      retryDelay: defaultFaliureCount,
    });

    /**
     * For able to edit lecture even when offline
     */
    queryClient.setMutationDefaults(mutationKeys.lectures.update, {
      mutationFn: updateLectureMutateFn,
      networkMode: "online",
      gcTime: Infinity,
      retry: 1,
      retryDelay: defaultFaliureCount,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.lectures.teacher,
        });
      },
    });

  }, [queryClient]);
};
