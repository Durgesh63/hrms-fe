import { createSlice } from "@reduxjs/toolkit";

const accessToken = localStorage.getItem("accessToken");

const initialState = {
  token: accessToken
    ? {
        accessToken,
      }
    : null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginToken: (state, action) => {
      localStorage.setItem("accessToken", action.payload?.accessToken);
      state.token = action.payload;
    },
    logOut: (state) => {
      localStorage.clear();
      state.token = null;
      state.user = null;
    },
    userInfo: (state, action) => {
      state.user = action.payload;
    },
   
  },
});

export const { loginToken, logOut, userInfo,} =
  authSlice.actions;

export default authSlice.reducer;
