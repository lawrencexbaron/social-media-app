import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import produce from "immer";
import { ENV_CONST } from "../components/utils/api/constants";

const base_api = ENV_CONST.BASE_URL;

const authHeader = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null,
      isLoading: false,
      isAuth: false,
      error: null,
      clearError: () => {
        set(
          produce((state) => {
            state.error = null;
          })
        );
      },
      success: false,
      setAuth: (isAuth: any) => {
        set(
          produce((state) => {
            state.isAuth = isAuth;
          })
        );
      },
      clearAuth: () => {
        set(
          produce((state) => {
            state.isAuth = false;
          })
        );
      },

      // setters
      setSuccess: (success: any) => {
        set(
          produce((state) => {
            state.success = success;
          })
        );
      },

      // getters
      isAuthenticated() {
        // return false if localstorage user and token is empty
        if (localStorage.getItem("user") && localStorage.getItem("token")) {
          return true;
        }
        return false;
      },
      getUser: async (id: string) => {
        try {
          // get user id from localstorage

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
          console.log(error);
          set(
            produce((state) => {
              state.error = (error as any)?.response?.data;
              state.success = false;
            })
          );
        }
      },

      // actions

      login: async (email: string, password: string) => {
        // destroy all localstorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
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
              state.error = (error as any)?.response?.data;
              state.success = false;
              state.isAuth = false;
            })
          );
        }
      },

      register: async (data: any) => {
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
              state.error = (error as any)?.response?.data;
              state.success = false;
              state.isAuth = false;
            })
          );
        }
      },

      refreshToken: async () => {
        try {
          const res = await axios.post(
            `${base_api}/api/auth/refresh`,
            {},
            {
              headers: authHeader(),
            }
          );
          set(
            produce((state) => {
              state.user = res.data.data;
              state.success = true;
              state.isAuth = true;
              state.error = null;
            })
          );
          // delete localstorage user and token then set new one
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.setItem("user", JSON.stringify(res.data.data));
          localStorage.setItem("token", res.data.token);
        } catch (error) {
          set(
            produce((state) => {
              state.error = (error as any)?.response?.data;
              state.success = false;
              state.isAuth = false;
            })
          );
        }
      },

      logout: () => {
        // delete localstorage user and token
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        set(
          produce((state) => {
            state.user = { name: "", avatarUrl: "" };
            state.isAuth = false;
            state.success = false;
          })
        );
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
