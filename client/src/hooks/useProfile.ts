import { useQuery } from "react-query";
import axios from "axios";
import { ENV_CONST } from "../components/utils/api/constants";

const base_api = ENV_CONST.BASE_URL;

export const useProfile = (userId: string) => {
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

export const useProfilePosts = (userId: string) => {
  const { data, isLoading, isError, error } = useQuery(
    ["profilePosts", userId],
    () => axios.get(`/api/posts/user/${userId}`).then((res) => res.data),
    { enabled: !!userId }
  );

  return { data, isLoading, isError, error };
};
