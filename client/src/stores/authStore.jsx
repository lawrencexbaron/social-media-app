import create from "zustand";
import axios from "axios";
import produce from "immer";

const base_api = "http://localhost:4000";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || { name: "", avatarUrl: "" },
  isLoading: false,
  isAuth: JSON.parse(localStorage.getItem("user")) ? true : false,
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

  // getters
  isAuthenticated() {
    // return false if localstorage user and token is empty
    if (!localStorage.getItem("user") && !localStorage.getItem("token")) {
      return false;
    }
  },
  getUser: () => {
    return get().user;
  },

  // actions
  login: async (email, password) => {
    try {
      const res = await axios.post(`${base_api}/api/auth/login`, {
        email,
        password,
      });
      set(
        produce((state) => {
          state.user = res.data.data;
          state.success = true;
          state.error = null;
          state.isAuth = true;
        })
      );
      localStorage.setItem("user", JSON.stringify(res.data.data));
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      set(
        produce((state) => {
          state.error = error.response.data;
          state.success = false;
          state.isAuth = false;
        })
      );
    }
  },

  register: async (data) => {
    try {
      const res = await axios.post(`${base_api}/api/auth/register`, data);
      set(
        produce((state) => {
          state.user = res.data.data;
          state.success = true;
          state.isAuth = true;
          state.error = null;
        })
      );
      localStorage.setItem("user", JSON.stringify(res.data.data));
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      set(
        produce((state) => {
          state.error = error.response.data;
          state.success = false;
          state.isAuth = false;
        })
      );
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set(
      produce((state) => {
        state.isAuth = false;
        state.user = null;
      })
    );
  },
}));
