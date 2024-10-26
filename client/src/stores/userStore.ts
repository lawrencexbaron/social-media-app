import { create } from "zustand";
import axios from "axios";
import produce from "immer";
import { ENV_CONST } from "../components/utils/api/constants";

const base_api = ENV_CONST.BASE_URL;

export const useUserStore = create((set) => {
  const authHeader = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  return {
    users: [],
    user: {},
    profile: {},
    isLoading: false,
    error: null,
    success: false,
    following: [],
    followers: [],

    // setters
    setSuccess: (success: string) => {
      set(
        produce((state) => {
          state.success = success;
        })
      );
    },

    // actions
    getUsers: async () => {
      try {
        const res = await axios.get(`${base_api}/api/users`, {
          headers: authHeader(),
        });
        set(
          produce((state) => {
            state.users = res.data.data;
            state.error = null;
          })
        );
        return res.data.data;
      } catch (error) {
        set(
          produce((state) => {
            state.error = error;
            state.success = false;
          })
        );
      }
    },

    changeCoverPhoto: async (id: string, data: string | Blob) => {
      const formData = new FormData();
      formData.append("coverPicture", data);

      try {
        const res = await axios.put(
          `${base_api}/api/users/${id}/cover-picture`,
          formData,
          {
            headers: {
              ...authHeader(),
              "Content-Type": "multipart/form-data",
            },
          }
        );

        set(
          produce((state) => {
            state.user = res.data.data; // Make sure the server returns the updated user data here
            state.error = null;
            state.success = true; // Setting success to true
          })
        );
      } catch (error: any) {
        console.error("Error updating cover photo:", error); // Logging the error
        set(
          produce((state) => {
            state.error = error.response
              ? error.response.data
              : "An error occurred";
            state.success = false;
          })
        );
      }
    },

    changeProfilePicture: async (id: any, data: string | Blob) => {
      const formData = new FormData();
      formData.append("profilePicture", data);

      try {
        const res = await axios.put(
          `${base_api}/api/users/${id}/profile-picture`,
          formData,
          {
            headers: {
              ...authHeader(),
              "Content-Type": "multipart/form-data",
            },
          }
        );

        set(
          produce((state) => {
            state.user = res.data.data; // Make sure the server returns the updated user data here
            state.error = null;
            state.success = true; // Setting success to true
          })
        );
      } catch (error: any) {
        console.error("Error updating profile picture:", error); // Logging the error
        set(
          produce((state) => {
            state.error = error.response
              ? error.response.data
              : "An error occurred";
            state.success = false;
          })
        );
      }
    },

    getFollowers: async (id: string) => {
      try {
        const res = await axios.get(`${base_api}/api/users/${id}/followers`, {
          headers: authHeader(),
        });
        set(
          produce((state) => {
            state.followers = res.data.followers;
            state.following = res.data.following;
            state.error = null;
          })
        );
        return res.data.data;
      } catch (error) {
        set(
          produce((state) => {
            state.error = error;
            state.success = false;
          })
        );
      }
    },

    getUser: async (id: string) => {
      try {
        const res = await axios.get(`${base_api}/api/users/${id}`, {
          headers: authHeader(),
        });
        set(
          produce((state) => {
            state.user = res.data.data;
            state.error = null;
          })
        );
      } catch (error: any) {
        set(
          produce((state) => {
            state.error = error.response.data;
            state.success = false;
          })
        );
      }
    },

    followUser: async (id: string) => {
      try {
        const res = await axios.post(
          `${base_api}/api/users/follow`,
          {
            id: id,
          },
          {
            headers: authHeader(),
          }
        );
        set(
          produce((state) => {
            state.user = res.data.data;
            state.getUser(id);
            state.getUsers();
            state.error = null;
          })
        );
      } catch (error: any) {
        set(
          produce((state) => {
            state.error = error.response.data;
            state.success = false;
          })
        );
      }
    },
    unfollowUser: async (id: string) => {
      try {
        const res = await axios.post(
          `${base_api}/api/users/unfollow`,
          {
            id: id,
          },
          {
            headers: authHeader(),
          }
        );
        set(
          produce((state) => {
            state.user = res.data.data;
            state.getUsers();
            state.getUser(id);
            state.error = null;
          })
        );
      } catch (error: any) {
        set(
          produce((state) => {
            state.error = error.response.data;
            state.success = false;
          })
        );
      }
    },

    // get user by username
    getUserByUsername: async (username: string) => {
      try {
        const res = await axios.get(
          `${base_api}/api/users/username/${username}`,
          {
            headers: authHeader(),
          }
        );
        set(
          produce((state) => {
            state.profile = res.data.data;
            state.error = null;
          })
        );
      } catch (error: any) {
        set(
          produce((state) => {
            state.error = error.response.data;
            state.success = false;
          })
        );
      }
    },

    updateUser: async (id: any, data: any) => {
      try {
        const res = await axios.put(`${base_api}/api/users/${id}`, data, {
          headers: {
            ...authHeader(),
          },
        });
        set(
          produce((state) => {
            state.user = res.data.data;
            state.error = null;
          })
        );
      } catch (error: any) {
        set(
          produce((state) => {
            state.error = error.response.data;
            state.success = false;
          })
        );
      }
    },

    deleteUser: async (id: string) => {
      try {
        const res = await axios.delete(`${base_api}/api/users/${id}`, {
          headers: authHeader(),
        });
        set(
          produce((state) => {
            state.user = res.data.data;
            state.error = null;
          })
        );
      } catch (error: any) {
        set(
          produce((state) => {
            state.error = error.response.data;
            state.success = false;
          })
        );
      }
    },

    createUser: async (data: any) => {
      try {
        const res = await axios.post(`${base_api}/api/users`, data, {
          headers: authHeader(),
        });
        set(
          produce((state) => {
            state.user = res.data.data;
            state.error = null;
          })
        );
      } catch (error: any) {
        set(
          produce((state) => {
            state.error = error.response.data;
            state.success = false;
          })
        );
      }
    },
  };
});
