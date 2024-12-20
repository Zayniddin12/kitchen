import { LOCALES } from "@/localization/localization.type";

export interface LanguageType{
  name: string,
  value: LOCALES
}

export type LanguagesType = LanguageType[];