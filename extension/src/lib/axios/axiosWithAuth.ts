"use client";

import axiosInstance from "./axiosIntance";

const axiosWithAuth = axiosInstance;

axiosWithAuth.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("local:token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosWithAuth.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("local:token");
      }
    }
    return Promise.reject(
      error.response ? error.response.data : "Something went wrong"
    );
  }
);

export default axiosWithAuth;
