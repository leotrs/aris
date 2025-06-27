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
const NotFoundView = isTest ? {} : () => import("@/views/notfound/View.vue");

const routes = [
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/", component: HomeView },
  { path: "/file/:file_id", component: WorkspaceView },
  { path: "/demo", component: DemoView },
  { path: "/account", component: AccountView },
  { path: "/settings", component: SettingsView },
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
  // Skip authentication entirely if testing with auth disabled
  if (import.meta.env.VITE_SKIP_AUTH_FOR_TESTS === "true") {
    return next();
  }

  const publicPages = ["/login", "/register", "/demo"];
  const authRequired = !publicPages.includes(to.path);
  if (!authRequired) return next();
  const token = localStorage.getItem("accessToken")?.trim();
  return !token ? next("/login") : next();
});

export default router;
