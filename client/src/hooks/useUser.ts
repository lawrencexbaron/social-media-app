import { useQuery, useMutation, useQueryClient } from "react-query";
import { getUsers, getUser, followUser } from "../utils/api";

export function useUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: "users",
    queryFn: getUsers,
  });

  return { data, isLoading, error };
}

export function useUser(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });

  return { data, isLoading, error };
}

export function useFollowUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation(() => followUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user", id]);
    },
  });
}
