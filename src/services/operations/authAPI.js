import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../apis";

const {
  SIGN_IN_API,
  SIGN_IN_USER_INFO_API,
  GENRATE_ACCESS_TOKEN_API,
  LOGOUT_API,
} = authEndpoints;


export const login = async (data) => {
  const response = await apiConnector("POST", SIGN_IN_API, data, {}, {}, true)
  
  if (response?.status !== 200) {
    console.log(response);
    
    throw new Error(response?.data?.message);
  }
  return response?.data;
};

export const genrateAccessToken = async (data) => {
  const response = await apiConnector(
    "POST",
    GENRATE_ACCESS_TOKEN_API,
    data,
    {},
    {},
    true,
  );

  if (response?.status !== 200) {
    throw new Error(response?.message);
  }
  return response?.data;
};

export const logOutAPI = async () => {
  const response = await apiConnector("POST", LOGOUT_API);

  if (!response?.data?.success) {
    throw new Error(response?.data?.message);
  }
  return response?.data;
};

export const loginUserInfo = async () => {
  const response = await apiConnector("GET", SIGN_IN_USER_INFO_API);

  if (!response?.data?.success) {
    throw new Error(response?.data?.message);
  }
  return response?.data;
};
