import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "@/App.vue";
import router from "@/router/router";
import "@/assets/styles/style.scss";
import i18n from "@/localization";
import "external-svg-loader";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app
    .use(ElementPlus)
    .use(createPinia())
    .use(router)
    .use(i18n)
    .mount("#app");
