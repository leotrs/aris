import { createRouter, createWebHistory } from "vue-router";
import { toast } from "@/utils/toast.js";
// Conditionally stub view components during testing to avoid .vue imports
const isTest = import.meta.env.TEST;
const LoginView = isTest ? {} : () => import("@/views/login/View.vue");
const RegisterView = isTest ? {} : () => import("@/views/register/View.vue");
const HomeView = isTest ? {} : () => import("@/views/home/View.vue");
const WorkspaceView = isTest ? {} : () => import("@/views/workspace/View.vue");
const DemoView = () => import("@/views/demo/View.vue");
const AccountView = isTest ? {} : () => import("@/views/account/View.vue");
const AccountProfileView = isTest ? {} : () => import("@/views/account/ProfileView.vue");
const AccountSecurityView = isTest ? {} : () => import("@/views/account/SecurityView.vue");
const AccountPrivacyView = isTest ? {} : () => import("@/views/account/PrivacyView.vue");
const SettingsView = isTest ? {} : () => import("@/views/settings/View.vue");
const SettingsDocumentView = isTest ? {} : () => import("@/views/settings/DocumentView.vue");
const SettingsBehaviorView = isTest ? {} : () => import("@/views/settings/BehaviorView.vue");
const SettingsPrivacyView = isTest ? {} : () => import("@/views/settings/PrivacyView.vue");
const SettingsSecurityView = isTest ? {} : () => import("@/views/settings/SecurityView.vue");
const NotFoundView = isTest ? {} : () => import("@/views/notfound/View.vue");

const routes = [
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/", component: HomeView },
  { path: "/file/:file_id", component: WorkspaceView },
  { path: "/demo", component: DemoView },
  {
    path: "/verify-email/:token",
    name: "EmailVerification",
    beforeEnter: async (to, from, next) => {
      const token = to.params.token;

      try {
        // Import axios here to avoid issues during testing
        const axios = (await import("axios")).default;

        // Create API instance with base URL
        const api = axios.create({
          baseURL: `http://localhost:${import.meta.env.VITE_BACKEND_PORT || 8000}`,
        });

        await api.post(`/users/verify-email/${token}`);

        // Update user in localStorage if exists
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          user.email_verified = true;
          localStorage.setItem("user", JSON.stringify(user));
        }

        toast.success("Email verified successfully!", {
          description: "Your email address has been verified.",
        });

        next("/account/security");
      } catch (error) {
        console.error("Email verification failed", error);

        let errorMessage = "Verification failed. Please try again.";
        if (error.response?.status === 400) {
          errorMessage = "Email is already verified";
        } else if (error.response?.status === 404) {
          errorMessage = "Invalid or expired verification link";
        }

        toast.error("Email verification failed", {
          description: errorMessage,
        });

        next("/account/security");
      }
    },
  },
  {
    path: "/account",
    component: AccountView,
    redirect: "/account/profile",
    children: [
      { path: "profile", component: AccountProfileView },
      { path: "security", component: AccountSecurityView },
      { path: "privacy", component: AccountPrivacyView },
    ],
  },
  {
    path: "/settings",
    component: SettingsView,
    redirect: "/settings/document",
    children: [
      { path: "document", component: SettingsDocumentView },
      { path: "behavior", component: SettingsBehaviorView },
      { path: "privacy", component: SettingsPrivacyView },
      { path: "security", component: SettingsSecurityView },
    ],
  },
  // dedicated 404 route
  { path: "/404", name: "NotFound", component: NotFoundView },
  // catch-all route: redirect to 404
  { path: "/:pathMatch(.*)*", redirect: "/404" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register", "/demo"];
  const isVerificationRoute = to.path.startsWith("/verify-email/");
  const authRequired = !publicPages.includes(to.path) && !isVerificationRoute;
  if (!authRequired) return next();

  // Check if authentication is disabled via environment variable
  const isAuthDisabled = import.meta.env.VITE_DISABLE_AUTH === "true";
  if (isAuthDisabled) return next();

  const token = localStorage.getItem("accessToken")?.trim();
  return !token ? next("/login") : next();
});

export default router;
