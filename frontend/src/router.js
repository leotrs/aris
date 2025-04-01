import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ReadView from './views/ReadView.vue';

const routes = [
    { path: '/', component: HomeView },
    { path: '/:doc_id/read', component: ReadView }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
