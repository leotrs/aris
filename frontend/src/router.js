import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./home/View.vue";
import MainView from "./main/View.vue";
import LoginView from "./login/View.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/:file_id/read", component: MainView },
  { path: "/login", component: LoginView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
