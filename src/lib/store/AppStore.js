import { create } from "zustand";

export const useAppStore = create((set) => ({
  sidebar: false,
  openSidebar: () => set({ sidebar: true }),
  closeSidebar: () => set({ sidebar: false }),
}));
