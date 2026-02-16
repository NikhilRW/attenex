import { useQueryClient } from "@tanstack/react-query";
import { mutationKeys } from "../constants/mutationKeys";
import {
  createLectureMutateFn,
  createNewClassMutateFN,
  nameUpdateMutateFn,
  roleUpdateMutateFn,
} from "../utils/offlineMutationFuncs";

export const useOfflineMutations = () => {
  const queryClient = useQueryClient();
  /**
   * For making the name update feature offline first.
   */
  queryClient.setMutationDefaults(mutationKeys.user.updateName, {
    mutationFn: nameUpdateMutateFn,
    networkMode: "offlineFirst",
    gcTime: Infinity,
    retry: 3,
    retryDelay: (failureCount) => {
      return Math.min(1000 * 2 * failureCount, 30000);
    },
  });

  /**
   * For making the role update feature offline first.
   */
  queryClient.setMutationDefaults(mutationKeys.user.updateRole, {
    mutationFn: roleUpdateMutateFn,
    networkMode: "offlineFirst",
    gcTime: Infinity,
    retry: 3,
    retryDelay: (failureCount) => {
      return Math.min(1000 * 2 * failureCount, 30000);
    },
  });

  /**
   * For able to add new class in an offline first way.
   */
  queryClient.setMutationDefaults(mutationKeys.classes.create, {
    mutationFn: createNewClassMutateFN,
    networkMode: "offlineFirst",
    gcTime: Infinity,
    retry: 1,
    retryDelay: (failureCount) => {
      return Math.min(1000 * 2 * failureCount, 30000);
    },
  });

  /**
   * For being able to add new lecture in an offline first way.
   */
  queryClient.setMutationDefaults(mutationKeys.lectures.create, {
    mutationFn: createLectureMutateFn,
    networkMode: "offlineFirst",
    gcTime: Infinity,
    retry: 1,
    retryDelay: (failureCount) => {
      return Math.min(1000 * 2 * failureCount, 30000);
    },
  });
};
