import { useQuery, useMutation, useQueryClient } from "react-query";

import { updateUser } from "../utils/api";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate, isLoading, error, isSuccess } = useMutation(
    (data) => updateUser(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
        queryClient.invalidateQueries(["profile"]);
      },
    }
  );

  return { mutate, isLoading, error, isSuccess };
}
