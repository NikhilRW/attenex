import { useQueryClient } from "@tanstack/react-query";
import { mutationKeys } from "../constants/mutationKeys";
import {
  createLectureMutateFn,
  createNewClassMutateFN,
  nameUpdateMutateFn,
  roleUpdateMutateFn,
} from "../utils/offlineMutationFuncs";
import { defaultFaliureCount } from "../utils/tanstack";

export const useOfflineMutations = () => {
  const queryClient = useQueryClient();
  /**
   * For making the name update feature offline first.
   */
  queryClient.setMutationDefaults(mutationKeys.user.updateName, {
    mutationFn: nameUpdateMutateFn,
    networkMode: "online",
    gcTime: Infinity,
    retry: 3,
    retryDelay:defaultFaliureCount ,
  });

  /**
   * For making the role update feature offline first.
   */
  queryClient.setMutationDefaults(mutationKeys.user.updateRole, {
    mutationFn: roleUpdateMutateFn,
    networkMode: "online",
    gcTime: Infinity,
    retry: 3,
    retryDelay:defaultFaliureCount ,
  });

  /**
   * For able to add new class in an offline first way.
   */
  queryClient.setMutationDefaults(mutationKeys.classes.create, {
    mutationFn: createNewClassMutateFN,
    networkMode: "online",
    gcTime: Infinity,
    retry: 1,
    retryDelay:defaultFaliureCount ,
  });

  /**
   * For being able to add new lecture in an offline first way.
   */
  queryClient.setMutationDefaults(mutationKeys.lectures.create, {
    mutationFn: createLectureMutateFn,
    networkMode: "online",
    gcTime: Infinity,
    retry: 1,
    retryDelay:defaultFaliureCount ,
  });


  /**
   * For being able to delete lecture in an offline first way.
   */
  queryClient.setMutationDefaults(mutationKeys.lectures.delete.default, {
    mutationFn:deleteLectureMutateFN,
    networkMode: "online",
    gcTime: Infinity,
    retry: 1,
    retryDelay:defaultFaliureCount ,
  });
};
