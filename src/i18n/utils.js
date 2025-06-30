import { ui, defaultLang } from "./ui.js";

export function useTranslations(lang) {
  return function translate(key) {
    return (ui[lang] && ui[lang][key]) || (ui[defaultLang] && ui[defaultLang][key]) || "";
  };
}