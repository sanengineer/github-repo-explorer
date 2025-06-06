import { create } from "zustand";

interface SearchState {
  isSearching: boolean;
  isFirstSearchng: boolean;
  setIsSearching: (state: boolean) => void;
  setIsFirstSearching: (state: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isSearching: false,
  isFirstSearchng: false,
  setIsSearching: (state) => set({ isSearching: state }),
  setIsFirstSearching: (state) => set({ isFirstSearchng: state }),
}));
