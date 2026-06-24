import React, { createContext, useContext, useState } from 'react';
import en from '../locales/en';
import id from '../locales/id';

const LanguageContext = createContext();

const translations = { en, id };

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('seetra_lang') || 'en';
  });

  const changeLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'id') {
      setLang(newLang);
      localStorage.setItem('seetra_lang', newLang);
    }
  };

  const t = (key) => {
    const translation = translations[lang]?.[key];
    if (translation !== undefined) {
      return translation;
    }
    // Fallback to English if translation is missing in the current language
    const enFallback = translations['en']?.[key];
    if (enFallback !== undefined) {
      return enFallback;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage: lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
