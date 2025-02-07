import { I18n } from "i18n-js";

import { getLocales } from "expo-localization";

import translations from "constants/localizations";

const i18n = new I18n(translations);

i18n.locale = getLocales()[0].languageCode || "en";
i18n.enableFallback = true;

type TranslationStructure = typeof translations.baseTranslations;

type DotNotation<T> = T extends object
  ? {
      [K in keyof T]: `${K & string}${T[K] extends object
        ? `.${DotNotation<T[K]>}`
        : ""}`;
    }[keyof T]
  : never;

type TranslationKey = DotNotation<TranslationStructure>;

export const t = (key: TranslationKey) => i18n.t(key);
