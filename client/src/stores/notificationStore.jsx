import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: [],
      isLoading: false,
      error: null,
      success: false,
      setNotifications: (notifications) => {
        set({ notifications });
      },
      clearNotifications: () => {
        set({ notifications: [] });
      },
      // setters
      setSuccess: (success) => {
        set({ success });
      },
      // getters
      getNotifications: () => {
        return JSON.parse(localStorage.getItem("notifications")) || [];
      },
    }),
    {
      name: "notification-storage",
    }
  )
);
