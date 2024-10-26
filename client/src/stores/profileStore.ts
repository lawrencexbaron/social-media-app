import { create } from "zustand";

export const useProfileStore = create((set) => ({
  profile: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null,
  setProfile: (profile: any) => set({ profile }),
  clearProfile: () => set({ profile: null }),
  isLoading: false,
  error: null,
}));
