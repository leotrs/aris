<script setup>
  import { ref, computed, provide, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import { createFileStore } from "@/store/FileStore.js";
  import { getLogger } from "@/utils/logger.js";
  import axios from "axios";

  const logger = getLogger("App");

  // Create API instance with base URL and error handling
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
  });

  logger.info("API instance created", { baseURL: import.meta.env.VITE_API_BASE_URL });

  // Add access token to every request
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      logger.debug("Added auth token to request", { url: config.url });
    }
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

      logger.apiError(error.config?.url || "unknown", error);
      return Promise.reject(error);
    }
  );
  provide("api", api);

  // Load RSM CSS
  const rsmLink = document.createElement("link");
  rsmLink.rel = "stylesheet";
  rsmLink.href = `${api.defaults.baseURL}/static/rsm.css`;
  document.head.appendChild(rsmLink);

  // Load design assets CSS
  const designAssets = ["typography.css", "components.css", "layout.css", "variables.css"];
  designAssets.forEach((filename) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${api.defaults.baseURL}/design-assets/css/${filename}`;
    document.head.appendChild(link);
  });

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

  // App-wide loading state
  const isAppLoading = ref(true);

  // Initialize authentication state on app mount
  onMounted(async () => {
    logger.info("Starting app initialization");
    const startTime = performance.now();

    try {
      const token = localStorage.getItem("accessToken");
      const storedUser = JSON.parse(localStorage.getItem("user"));

      // Check if authentication is disabled
      const isAuthDisabled = import.meta.env.VITE_DISABLE_AUTH === "true";

      if (token && storedUser) {
        logger.info("Found existing auth credentials", { userId: storedUser.id });
        user.value = storedUser;
        fileStore.value = createFileStore(api, user.value);

        logger.debug("Loading user files and tags");
        await fileStore.value.loadFiles();
        await fileStore.value.loadTags();
        logger.info("App initialization completed successfully");
      } else if (isAuthDisabled) {
        logger.info("Auth disabled, fetching test user");
        try {
          const response = await api.get("/me");
          user.value = response.data;
          fileStore.value = createFileStore(api, user.value);

          logger.debug("Loading test user files and tags");
          await fileStore.value.loadFiles();
          await fileStore.value.loadTags();
          logger.info("App initialization completed with test user");
        } catch (error) {
          logger.error("Failed to fetch test user", error);
        }
      } else {
        logger.info("No auth credentials found, cleaning storage");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    } catch (error) {
      logger.error("App initialization failed", error);
    } finally {
      const duration = performance.now() - startTime;
      logger.performance("App initialization", duration);
      isAppLoading.value = false;
    }
  });

  // Handle authentication redirects after router is ready
  router.beforeResolve((to, from, next) => {
    const token = localStorage.getItem("accessToken");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const publicPages = ["/login", "/register", "/demo"];

    // Check if authentication is disabled via environment variable
    const isAuthDisabled = import.meta.env.VITE_DISABLE_AUTH === "true";
    if (isAuthDisabled) return next();

    // If user is not authenticated and trying to access a protected page
    if (!token && !storedUser && !publicPages.includes(to.path)) {
      next("/login");
    } else {
      next();
    }
  });
  provide("user", user);
  provide("fileStore", fileStore);

  const isDev = import.meta.env.VITE_ENV === "DEV";
  provide("isDev", isDev);

  // Determine which clone this is based on backend port
  const getCloneInfo = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "";
    const portMatch = apiUrl.match(/:(\d+)/);
    const port = portMatch ? parseInt(portMatch[1]) : 8000;
    return `LOCAL:${port}`;
  };

  const cloneInfo = getCloneInfo();

  // Shortcuts modal
  const showShortcutsModal = ref(false);
  useKeyboardShortcuts(
    {
      "?": {
        fn: () => (showShortcutsModal.value = !showShortcutsModal.value),
        description: "Show keyboard shortcuts help",
      },
    },
    true,
    "Global"
  );

  // Main sidebar collapsed state - here only because it's shared by multiple views
  const sidebarIsCollapsed = ref(false);
  provide("sidebarIsCollapsed", sidebarIsCollapsed);
</script>

<template>
  <div v-if="isAppLoading" class="app-loading">
    <LoadingSpinner size="large" message="Loading Aris..." />
  </div>
  <template v-else>
    <RouterView :class="`bp-${breakpoints.active().value}`" />
    <div v-if="isDev" id="env">{{ cloneInfo }}</div>

    <ModalShortcuts v-if="showShortcutsModal" @close="showShortcutsModal = false" />
  </template>
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
    bottom: 0px;
    right: 0px;
    color: var(--dark);
    background-color: var(--green-100);
    opacity: 0.3;
    padding: 4px;
    border-radius: 16px;
    z-index: 999;
    pointer-events: none;
  }

  .app-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: var(--extra-light);
  }
</style>
