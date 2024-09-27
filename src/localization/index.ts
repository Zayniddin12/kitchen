import { createI18n, type I18nOptions } from 'vue-i18n';

import uz from './locale/uz.json';
import ru from './locale/ru.json';

// Define the type for messages based on the structure of uz.json and ru.json
interface Messages {
  uz: typeof uz;
  ru: typeof ru;
}

let language = localStorage.getItem('language') || 'ru';

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
const i18n = createI18n<Messages>(i18nOptions);

export default i18n;
