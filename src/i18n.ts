// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Risorse di traduzione
import itTranslations from "./locales/it.json";
import enTranslations from "./locales/en.json";

/**
 * @TODO_REAL_PROJECT: Internationalization (i18n) configuration.
 * Provides multi-language support to ensure the application is accessible to a global audience.
 * * PUBLIC DEMO VERSION: Preserved to showcase production-ready localization setup.
 */
i18n
  .use(initReactI18next)
  .init({
    resources: {
      it: { translation: itTranslations },
      en: { translation: enTranslations }
    },
    lng: "it", // Default language
    fallbackLng: "it",
    interpolation: {
      escapeValue: false // React already protects against XSS
    }
  });

export default i18n;