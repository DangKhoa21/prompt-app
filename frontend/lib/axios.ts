"use client";

import axios from "axios";
import { SERVER_URL, VERSION_PREFIX } from "@/config";

const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}/${VERSION_PREFIX}`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(
      error.response ? error.response.data : "Something went wrong"
    );
  }
);

export default axiosInstance;
