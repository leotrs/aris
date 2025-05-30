<script setup>
  import { ref, computed, provide, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
  import {
    getRegisteredComponents,
    useKeyboardShortcuts,
  } from "@/composables/useKeyboardShortcuts.js";
  import { createFileStore } from "./FileStore.js";
  import axios from "axios";

  // Create API instance with base URL and error handling
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
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
            const response = await api.post("/refresh", {
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

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `${api.getUri()}/static/rsm.css`;
  document.head.appendChild(link);

  // Provide viewport info
  const breakpoints = useBreakpoints({ xs: 425, ...breakpointsTailwind });
  provide("breakpoints", breakpoints);

  const xsMode = computed(() => breakpoints.smallerOrEqual("xs").value);
  provide("xsMode", xsMode);
  const mobileMode = computed(() => breakpoints.smallerOrEqual("sm").value);
  provide("mobileMode", mobileMode);

  // Must create these here as they will be populated by the login view but need to be
  // available to other views.
  const user = ref(null);
  const fileStore = ref(null);
  const router = useRouter();
  onMounted(async () => {
    const token = localStorage.getItem("accessToken");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (token && storedUser) {
      user.value = storedUser;
      fileStore.value = createFileStore(api, user.value);
      await fileStore.value.loadFiles();
      await fileStore.value.loadTags();
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      router.push("/login");
    }
  });
  provide("user", user);
  provide("fileStore", fileStore);

  const isDev = import.meta.env.VITE_ENV === "DEV";

  // Shortcuts modal
  const shortcutsModal = () => {
    const comps = getRegisteredComponents();

    const excludedKeys = new Set(["escape", "enter", "arrowdown", "arrowup", "j", "k", "?"]);
    const hasShortcuts = (shortcuts) => Object.keys(shortcuts).length > 0;
    const filterShortcuts = (shortcuts) =>
      Object.fromEntries(Object.entries(shortcuts).filter(([key]) => !excludedKeys.has(key)));

    const filteredComps = Object.fromEntries(
      Object.entries(comps)
        .map(([name, shortcuts]) => [name, filterShortcuts(shortcuts)])
        .filter(([, shortcuts]) => hasShortcuts(shortcuts))
    );

    // Remove duplicates - keep first occurrence of each unique shortcut set
    const seenShortcuts = new Set();
    const deduped = Object.fromEntries(
      Object.entries(filteredComps).filter(([name, shortcuts]) => {
        const shortcutKey = JSON.stringify(Object.keys(shortcuts).sort());
        if (seenShortcuts.has(shortcutKey)) return false;
        seenShortcuts.add(shortcutKey);
        return true;
      })
    );

    console.log(deduped);
  };
  useKeyboardShortcuts({ "?": shortcutsModal }, true);
</script>

<template>
  <RouterView :class="`bp-${breakpoints.active().value}`" />
  <div v-if="isDev" id="env">DEV/LOCAL</div>
</template>

<style>
  body {
    background-color: var(--gray-75);
  }

  #app {
    background-color: var(--extra-light);
    display: flex;
    height: 100%;
    margin: 0 auto;
    border-radius: 24px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: var(--weight-regular);
    font-size: 16px;
    line-height: 1.25;
    color: var(--extra-dark);
  }

  #env {
    position: fixed;
    bottom: 8px;
    left: 8px;
    color: var(--dark);
    background-color: var(--green-100);
    padding: 4px;
    border-radius: 16px;
    z-index: 999;
  }
</style>
