import create from "zustand";
import axios from "axios";
import produce from "immer";

const base_api = "http://localhost:4000";

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
    isLoading: false,
    error: null,
    success: false,

    // setters
    setSuccess: (success) => {
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
        console.log(res.data.data);
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
    getUser: async (id) => {
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
      } catch (error) {
        set(
          produce((state) => {
            state.error = error.response.data;
            state.success = false;
          })
        );
      }
    },

    updateUser: async (id, data) => {
      try {
        const res = await axios.put(`${base_api}/api/users/${id}`, data, {
          headers: authHeader(),
        });
        set(
          produce((state) => {
            state.user = res.data.data;
            state.error = null;
          })
        );
      } catch (error) {
        set(
          produce((state) => {
            state.error = error.response.data;
            state.success = false;
          })
        );
      }
    },

    deleteUser: async (id) => {
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
      } catch (error) {
        set(
          produce((state) => {
            state.error = error.response.data;
            state.success = false;
          })
        );
      }
    },

    createUser: async (data) => {
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
      } catch (error) {
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
