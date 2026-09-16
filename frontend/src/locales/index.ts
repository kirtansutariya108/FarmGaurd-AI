import { en } from './en';
import { hi } from './hi';
import { gu } from './gu';

export type LanguageCode = 'en' | 'hi' | 'gu';

export const locales = {
  en,
  hi,
  gu,
};

export const languageNames: Record<LanguageCode, { label: string; nativeName: string }> = {
  en: { label: 'English', nativeName: 'English' },
  hi: { label: 'Hindi', nativeName: 'हिन्दी' },
  gu: { label: 'Gujarati', nativeName: 'ગુજરાતી' },
};
