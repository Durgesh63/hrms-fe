import axios from "axios";
import { genrateAccessToken } from "./operations/authAPI";
import { loginToken, logOut } from "../redux/reducer/auth.slice";
import { Store } from "../redux/Store";
import { setLoading } from "../redux/reducer/loader.slice";

const getAccessToken = () => Store.getState().auth.token?.accessToken;
const setToken = (accessToken) => {
  // Preserve existing service token during refresh
  Store.dispatch(
    loginToken({
      accessToken: accessToken,
    })
  );
};

const clearTokens = () => {
  Store.dispatch(logOut());
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(
  (config) => {
    // Check for custom flag to skip token
    if (!config.skipLoading) {
      Store.dispatch(setLoading(true));
    }
    if (!config.skipAuth) {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (!response.config.skipLoading) {
      Store.dispatch(setLoading(false));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.skipAuth
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .finally(() => {
            if (!originalRequest.skipLoading) {
              Store.dispatch(setLoading(false));
            }
          });
      }

      isRefreshing = true;

      try {
        const accessToken = getAccessToken();

        const res = await genrateAccessToken({ accessToken });
        const newAccessToken = res.accessToken;
        setToken(newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
        if (!originalRequest.skipLoading) {
          Store.dispatch(setLoading(false));
        }
      }
    }

    
    if (!originalRequest.skipLoading) {
      Store.dispatch(setLoading(false));
    }
    return Promise.reject(error);
  }
);

export const apiConnector = (
  method,
  url,
  bodyData,
  headers,
  params,
  skipAuth = false,
  skipLoading = false,
  responseType = "json"
) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
    skipAuth,
    skipLoading,
    responseType,
  });
};
