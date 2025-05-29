import { createRouter, createWebHistory } from "vue-router";
import LoginView from "./login/View.vue";
import HomeView from "./home/View.vue";
import MainView from "./main/View.vue";
import UserView from "./user/View.vue";

const routes = [
  { path: "/login", component: LoginView },
  { path: "/", component: HomeView },
  { path: "/file/:file_id", component: MainView },
  { path: "/account", component: UserView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem("accessToken");
  return (authRequired && !token) ? next("/login") : next();
});

export default router;
