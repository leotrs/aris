import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./home/View.vue";
import ReadView from "./read/View.vue";
import WriteView from "./write/View.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/:file_id/read", component: ReadView },
  { path: "/:file_id/write", component: WriteView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
