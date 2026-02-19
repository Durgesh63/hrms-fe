import { configureStore } from "@reduxjs/toolkit";
import { combineReducer } from "./reducer/index.reducer";

export const Store = configureStore({
  reducer: combineReducer,
});
