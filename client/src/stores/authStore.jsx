import create from "zustand";
import { useNavigate } from "react-router-dom";

export const useAuthStore = create((set, get) => ({
  user: null,
  // set user with token to local storage
  setUser: (user) => {
    set({ user });
    localStorage.setItem("token", user.token);
  },
  // redirect to login page if user is not logged in
  redirectIfNotLoggedIn: () => {
    if (!get().user) {
      navigate("/login");
    }
  },
  isLoggedIn: () => !!get().user,
  logout: () => {
    console.log(get().user);
    set({ user: null });
    console.log("logout");
    localStorage.removeItem("token");
  },
}));
