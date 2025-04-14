import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./home/View.vue";
import ReadView from "./read/View.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/:doc_id/read", component: ReadView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
