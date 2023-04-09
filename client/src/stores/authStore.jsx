import create from "zustand";
// import { useNavigate } from "react-router-dom";

export const useAuthStore = create((set, get, api) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return {
    user: user || null,
    token: null,
    setUser: (user) => {
      set({ user });
      localStorage.setItem("user", JSON.stringify(user));
    },
    setToken: (token) => {
      set({ token });
      localStorage.setItem("token", token);
    },
    //get user then if user is null redirect to login page
    getUser: () => {
      const user = JSON.parse(localStorage.getItem("user"));
      set({ user });
    },

    // redirect to login page if user is not logged in
    redirectIfNotLoggedIn: () => {
      if (!get().user) {
        // navigate("/login");
      }
    },
    isLoggedIn: () => !!get().user,
    logout: () => {
      console.log(get().user);
      set({ user: null });
      console.log("logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("removed token: " + localStorage.getItem("token"));
    },
  };
});
