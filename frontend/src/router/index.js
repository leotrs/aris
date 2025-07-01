import { createRouter, createWebHistory } from "vue-router";
// Conditionally stub view components during testing to avoid .vue imports
const isTest = import.meta.env.TEST;
const LoginView = isTest ? {} : () => import("@/views/login/View.vue");
const RegisterView = isTest ? {} : () => import("@/views/register/View.vue");
const HomeView = isTest ? {} : () => import("@/views/home/View.vue");
const WorkspaceView = isTest ? {} : () => import("@/views/workspace/View.vue");
const DemoView = () => import("@/views/demo/View.vue");
const AccountView = isTest ? {} : () => import("@/views/account/View.vue");
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
  { path: "/account", component: AccountView },
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
  const authRequired = !publicPages.includes(to.path);
  if (!authRequired) return next();

  // Check if authentication is disabled via environment variable
  const isAuthDisabled = import.meta.env.VITE_DISABLE_AUTH === "true";
  if (isAuthDisabled) return next();

  const token = localStorage.getItem("accessToken")?.trim();
  return !token ? next("/login") : next();
});

export default router;
