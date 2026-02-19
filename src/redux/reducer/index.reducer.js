import loaderReducer from "./loader.slice.js";
import authReducer from "./auth.slice.js";
export const combineReducer = {
  loader: loaderReducer,
  auth: authReducer,
};
