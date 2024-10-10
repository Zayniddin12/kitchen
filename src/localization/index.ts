import { createI18n, type I18nOptions } from "vue-i18n";

import uz from "@/localization/locale/uz.json";
import ru from "@/localization/locale/ru.json";
import { getItem } from "@/utils/localStorage";

// Define the type for messages based on the structure of uz.json and ru.json
interface Messages {
  uz?: typeof uz;
  ru?: typeof ru;
}

let language = getItem("language") || "ru";

// Create I18n options with proper typing
const i18nOptions: I18nOptions<Messages> = {
  legacy: false,
  globalInjection: true,
  locale: import.meta.env.VITE_APP_I18N_LOCALE || language,
  fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || language,
  messages: {
    uz,
    ru,
  },
};

// Create i18n instance with typed messages
const i18n = createI18n<Messages>(i18nOptions as any);

export default i18n;
