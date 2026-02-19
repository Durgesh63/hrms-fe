import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 isLoading:false,
};

export const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    closeLoading: (state) => {
      state.isLoading = false
    },
  },
});

export const { setLoading, closeLoading } = loaderSlice.actions;

export default loaderSlice.reducer;
