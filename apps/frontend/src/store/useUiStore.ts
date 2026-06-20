import { create } from "zustand";

interface UiState {
  isSidebarOpen: boolean;
  isAiPanelOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  openAiPanel: () => void;
  closeAiPanel: () => void;
  toggleAiPanel: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: false,
  isAiPanelOpen: false,
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openAiPanel: () => set({ isAiPanelOpen: true }),
  closeAiPanel: () => set({ isAiPanelOpen: false }),
  toggleAiPanel: () => set((state) => ({ isAiPanelOpen: !state.isAiPanelOpen })),
}));
