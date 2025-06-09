import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';

const app = createApp(App).use(router);

const modules = import.meta.glob('./components/*.vue', { eager: true });
for (const path in modules) {
  const component = modules[path].default;
  app.component(component.__name, component);
}

app.mount('#app');
