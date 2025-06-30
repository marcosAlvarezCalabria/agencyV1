import en from './en.json';
import es from './es.json';

const translations = { en, es };
const defaultLang = 'es';

export function useTranslations(lang) {
  return function t(key) {
    // Soporta claves anidadas tipo "hero.title"
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    // Fallback al idioma por defecto
    if (value === undefined) {
      value = translations[defaultLang];
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
    }
    return value || '';
  };
}