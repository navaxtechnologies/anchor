import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import en from './en';
import es from './es';
import type { Language } from '@/types';

// Default to the device language when it's Spanish; otherwise English.
function deviceLanguage(): Language {
  const code = getLocales()[0]?.languageCode ?? 'en';
  return code === 'es' ? 'es' : 'en';
}

export function initI18n(initial?: Language) {
  if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        es: { translation: es },
      },
      lng: initial ?? deviceLanguage(),
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      returnNull: false,
    });
  }
  return i18n;
}

export function setLanguage(lang: Language) {
  void i18n.changeLanguage(lang);
}

export { deviceLanguage };
export default i18n;
