import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";
import "@/assets/styles/style.scss";
import i18n from './localization/index.js'

const app = createApp(App);

app
  .use(ElementPlus)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .mount("#app");
