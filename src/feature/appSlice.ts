import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store"; // Stelle sicher, dass RootState korrekt importiert ist

interface IAppState {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
}

const initialState: IAppState = {
  isSidebarOpen: false,
  isDarkMode: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { toggleSidebar, toggleDarkMode } = appSlice.actions;
export const selectIsSidebarOpen = (state: RootState) =>
  state.app.isSidebarOpen;

export default appSlice.reducer;
