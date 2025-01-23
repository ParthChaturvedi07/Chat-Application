import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "themeSlice",
  initialState: true,
  reducers: {
    toggleTheme: (state) => {
      return !state;
    },
  },
});

// Actions
export const { toggleTheme } = themeSlice.actions; ///sam name as the name of reducer function
export default themeSlice.reducer;
