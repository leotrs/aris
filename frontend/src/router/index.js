import { createRouter, createWebHistory } from "vue-router";
// Conditionally stub view components during testing to avoid .vue imports
const isTest = import.meta.env.TEST;
const LoginView = isTest ? {} : () => import("@/views/login/View.vue");
const RegisterView = isTest ? {} : () => import("@/views/register/View.vue");
const HomeView = isTest ? {} : () => import("@/views/home/View.vue");
const WorkspaceView = isTest ? {} : () => import("@/views/workspace/View.vue");
const AccountView = isTest ? {} : () => import("@/views/account/View.vue");
const SettingsView = isTest ? {} : () => import("@/views/settings/View.vue");
const NotFoundView = isTest ? {} : () => import("@/views/notfound/View.vue");

const routes = [
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/", component: HomeView },
  { path: "/file/:file_id", component: WorkspaceView },
  { path: "/account", component: AccountView },
  { path: "/settings", component: SettingsView },
  // catch-all route: 404
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem("accessToken")?.trim();
  return authRequired && !token ? next("/login") : next();
});

export default router;
