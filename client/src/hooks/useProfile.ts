import { useQuery } from "react-query";
import axios from "axios";

const base_api = import.meta.env.VITE_BACKEND_API;

export const useProfile = (userId) => {
  const { data, isLoading, isError, error } = useQuery(
    ["profile", userId],
    async () => {
      const response = await axios.get(`${base_api}/api/users/${userId}`);
      return response.data;
    },
    { enabled: !!userId }
  );

  return { data, isLoading, isError, error };
};

export const useProfilePosts = (userId) => {
  const { data, isLoading, isError, error } = useQuery(
    ["profilePosts", userId],
    () => axios.get(`/api/posts/user/${userId}`).then((res) => res.data),
    { enabled: !!userId }
  );

  return { data, isLoading, isError, error };
};
