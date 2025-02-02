import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "@/App.vue";
import router from "@/router";
import "@/assets/styles/style.scss";
import i18n from "@/localization";
import "external-svg-loader";
import dayjs from "dayjs";
import "dayjs/locale/ru"; // Import Russian locale
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(updateLocale);
dayjs.updateLocale("ru", {
  weekStart: 1, // Monday as the first day of the week
});

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

import { abilitiesPlugin } from "@casl/vue";
import { defineAbilitiesFor } from "@/mixins/ability";

const role = JSON.parse(localStorage.getItem("user_role"));

const ability = defineAbilitiesFor([role]);

app
  .use(ElementPlus, {
    locale: "ru",
  })
  .use(createPinia())
  .use(abilitiesPlugin, ability, {
    useGlobalProperties: true,
  })
  .use(router)
  .use(i18n)
  .mount("#app");
