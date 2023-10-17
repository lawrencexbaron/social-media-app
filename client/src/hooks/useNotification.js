import { useQuery } from "react-query";
import axios from "axios";

const base_api = "http://localhost:4000";

const authHeader = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export const useNotification = () => {
  const { data, isLoading, isError, error } = useQuery(
    ["notifications"],
    async () => {
      const response = await axios.get(`${base_api}/api/notifications`, {
        headers: authHeader(),
      });
      return response.data;
    },
    { enabled: true }
  );

  return { data, isLoading, isError, error };
};
