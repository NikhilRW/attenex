import { useQueryClient } from "@tanstack/react-query";
import { mutationKeys } from "../constants/mutationKeys";
import { handleNameUpdateMutateFn } from "../utils/offlineMutationFuncs";

export const useOfflineMutations = () => {
  const queryClient = useQueryClient();
  queryClient.setMutationDefaults(mutationKeys.user.updateName, {
    mutationFn: handleNameUpdateMutateFn,
    networkMode: "offlineFirst",
    gcTime: Infinity,
    retry: 3,
    retryDelay: (failureCount) => {
      return Math.min(1000 * 2 * failureCount, 30000);
    },
  });
};
