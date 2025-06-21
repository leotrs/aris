import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";

const app = createApp(App).use(router);

const modules = import.meta.glob("./components/**/*.vue", { eager: true });
for (const path in modules) {
  const component = modules[path].default;
  const componentName = component.__name || path.split("/").pop().replace(".vue", "");
  app.component(componentName, component);
}

app.mount("#app");
