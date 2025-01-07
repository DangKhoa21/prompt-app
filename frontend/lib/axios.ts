"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

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
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        const router = useRouter();
        router.push("/login");
      }
    }
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export default axiosInstance;
