import { create } from "zustand";

export const useProfileStore = create((set) => ({
  profile: null ? JSON.parse(localStorage.getItem("user")) : null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
  isLoading: false,
  error: null,
}));
