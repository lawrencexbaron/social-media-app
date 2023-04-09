import create from "zustand";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
} from "../utils/api";
import { queryClient } from "../utils/queryClient";

export const useUserStore = create((set, get) => {
  const authHeader = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  return {
    users: [],
    user: null,
    fetchUsers: () => {
      return useQuery("users", getUsers(), {
        headers: authHeader(),
        onSuccess: (data) => {
          set({ users: data });
        },
      });
    },
    fetchUser: (id) => {
      return useQuery(["user", id], () => getUser(id), {
        headers: authHeader(),
        onSuccess: (data) => {
          set({ user: data });
        },
      });
    },

    updateUser: (id, data) => {
      return useMutation(() => updateUser(id, data), {
        headers: authHeader(),
        onSuccess: (data) => {
          set({ user: data });
          queryClient.invalidateQueries(["user", id]);
        },
      });
    },
    deleteUser: (id) => {
      return useMutation(() => deleteUser(id), {
        headers: authHeader(),
        onSuccess: (data) => {
          set({ user: data });
          queryClient.invalidateQueries("users");
        },
      });
    },
    followUser: (id) => {
      return useMutation(() => followUser(id), {
        headers: authHeader(),
        onSuccess: (data) => {
          set({ user: data });
          queryClient.invalidateQueries(["user", id]);
        },
      });
    },
    unfollowUser: (id) => {
      return useMutation(() => unfollowUser(id), {
        headers: authHeader(),
        onSuccess: (data) => {
          set({ user: data });
          queryClient.invalidateQueries(["user", id]);
        },
      });
    },
  };
});
