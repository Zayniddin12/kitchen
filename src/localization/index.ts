import { createI18n } from "vue-i18n";
import uz from "@/localization/locale/uz.json";
import ru from "@/localization/locale/ru.json";
import { getItem, setItem } from "@/utils/localStorage";
import { LanguageType, LOCALES } from "@/localization/localization.type";
import { computed, reactive, ref, watch } from "vue";

const localeKey = "language";

export const availableLocales = reactive<LOCALES[]>(Object.values(LOCALES));
export const defaultLocale: LOCALES = LOCALES.RU;

const isValidLocale = (locale: string): locale is LOCALES =>
  availableLocales.includes(locale as LOCALES);

const getStoredLocale = (): string => getItem(localeKey) ?? defaultLocale;

export const activeLocale = ref<LOCALES>(
  isValidLocale(getStoredLocale()) ? (getStoredLocale() as LOCALES) : defaultLocale,
);

export const languages = reactive<LanguageType[]>([
  { title: "O'zbekcha", value: LOCALES.UZ },
  { title: "Русский", value: LOCALES.RU },
]);

export const activeLanguage = computed(() => {
  return languages.find(language => language.value === activeLocale.value) ?? languages[0];
});

const i18nInstance = createI18n({
  legacy: false,
  globalInjection: true,
  fallbackLocale: defaultLocale,
  messages: { uz, ru },
  locale: activeLocale.value,
});

export const i18n = i18nInstance.global;

const updateDocumentLanguage = (locale: LOCALES) => {
  document.documentElement.setAttribute("lang", locale);
};

watch(activeLocale, (newLocale) => {
  i18n.locale.value = newLocale;
  setItem(localeKey, newLocale);
  updateDocumentLanguage(newLocale);
}, { immediate: true });

export const changeLocale = (locale: LOCALES) => {
  if (isValidLocale(locale)) {
    activeLocale.value = locale;
    window.location.reload();
  }
};

export default i18nInstance;
