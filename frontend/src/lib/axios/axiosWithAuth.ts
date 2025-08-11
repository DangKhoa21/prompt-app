"use client";

import axiosInstance from "./axiosIntance";

const axiosWithAuth = axiosInstance;

axiosWithAuth.interceptors.request.use(
  async (config) => {
    try {
      const res = await fetch("/api/auth/token", { credentials: "include" });
      const { token } = await res.json();
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Failed to fetch token", err);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosWithAuth.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        await fetch("/api/auth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: null }),
        });
      }
    }
    return Promise.reject(
      error.response ? error.response.data : "Something went wrong",
    );
  },
);

export default axiosWithAuth;
