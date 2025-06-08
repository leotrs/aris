import { createRouter, createWebHistory } from "vue-router";
import LoginView from "./login/View.vue";
import RegisterView from "./register/View.vue";
import HomeView from "./home/View.vue";
import MainView from "./main/View.vue";
import UserView from "./user/View.vue";
import SettingsView from "./settings/View.vue";
import NotFoundView from "./notfound/View.vue";


const routes = [
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/", component: HomeView },
  { path: "/file/:file_id", component: MainView },
  { path: "/account", component: UserView },
  { path: "/settings", component: SettingsView },
  // catch-all route: 404
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem("accessToken")?.trim();
  return (authRequired && !token) ? next("/login") : next();
});


export default router;
