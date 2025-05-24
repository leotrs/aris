<script setup>
  import { computed, provide, onMounted } from "vue";
  import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
  import axios from "axios";
  import { createFileStore } from "./FileStore.js";

  // Create API instance with base URL and error handling
  const api = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 10000,
  });

  // Add access token to every request
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach((callback) => callback());
    failedQueue = [];
  };

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        localStorage.getItem("refreshToken")
      ) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            const response = await axios.post("http://localhost:8000/refresh", {
              refresh_token: refreshToken,
            });

            const newAccessToken = response.data.access_token;
            localStorage.setItem("accessToken", newAccessToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
            isRefreshing = false;
            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError, null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        } else {
          return new Promise((resolve, reject) => {
            failedQueue.push(() => {
              originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
              resolve(api(originalRequest));
            });
          });
        }
      }

      console.error(`API Error: ${error.message}`, error);
      return Promise.reject(error);
    }
  );
  provide("api", api);

  // Provide user info
  const user = { id: 1, name: "TER" };
  provide("user", user);

  // Create and provide file store
  const fileStore = createFileStore(api, user);
  provide("fileStore", fileStore);

  // Provide viewport info
  const breakpoints = useBreakpoints(breakpointsTailwind);
  provide("breakpoints", breakpoints);
  /* const isMobile = computed(() => breakpoints.smaller("md")); */
  const isMobile = computed(() => false);
  provide("isMobile", isMobile);
</script>

<template>
  <RouterView />
</template>

<style>
  #app {
    background-color: var(--extra-light);
    display: flex;
    height: 100%;
    font-family: "Source Sans 3", sans-serif;
    font-weight: var(--weight-regular);
    font-size: 16px;
    line-height: 1.25;
    color: var(--extra-dark);
  }
</style>
