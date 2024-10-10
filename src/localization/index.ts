import { createI18n, I18nOptions } from 'vue-i18n';
import uz from './locale/uz.json';
import ru from './locale/ru.json';

interface MessageSchema {
  [key: string]: string | MessageSchema;
}

interface Messages {
  uz: MessageSchema;
  ru: MessageSchema;
}

let language = localStorage.getItem('language') || 'ru';

const i18nOptions: I18nOptions = {
  legacy: false,
  globalInjection: true,
  locale: import.meta.env.VITE_APP_I18N_LOCALE || language,
  fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || language,
  messages: {
    uz,
    ru,
  },
};

const i18n = createI18n(i18nOptions);

export default i18n;
