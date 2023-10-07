import { useQuery } from "react-query";
import { getPost } from "../utils/api";

export function usePost(id) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });

  return { data, isLoading, error };
}
