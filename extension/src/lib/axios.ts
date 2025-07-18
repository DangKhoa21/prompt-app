"use client";

import axios from "axios";
import { SERVER_URL, VERSION_PREFIX } from "@/config";

const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}/${VERSION_PREFIX}`,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem("local:token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        await storage.removeItem("local:token");
      }
    }
    return Promise.reject(
      error.response ? error.response.data : "Something went wrong"
    );
  }
);

export default axiosInstance;
