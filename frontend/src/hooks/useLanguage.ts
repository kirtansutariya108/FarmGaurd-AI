import { useState, useEffect } from 'react';
import { locales, LanguageCode } from '../locales';

export function useLanguage() {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('farmguard_lang') as LanguageCode;
    return saved && locales[saved] ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('farmguard_lang', language);
  }, [language]);

  const t = locales[language] || locales.en;

  return { language, setLanguage, t };
}
