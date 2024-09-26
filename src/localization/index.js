import {createI18n} from 'vue-i18n'

import uz from './locale/uz.json'
import ru from './locale/ru.json'

let language = localStorage.getItem('language')

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: import.meta.env.VITE_APP_I18N_LOCALE || language || "ru",
  fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || language || "ru",
  messages: {
    uz,
    ru,
  }
})

export default i18n