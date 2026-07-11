import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'lang';
const SUPPORTED = ['en', 'uz'];

// First visit: guess from the browser, defaulting to English. Uzbek visitors
// (navigator.language like "uz", "uz-UZ", "uz-Latn") land on the Uzbek site.
function detectLang() {
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || 'en'];
  for (const l of langs) {
    if (l && l.toLowerCase().startsWith('uz')) return 'uz';
  }
  return 'en';
}

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch {
    /* localStorage unavailable (private mode) — fall back to detection */
  }
  return detectLang();
}

const LanguageContext = createContext({ lang: 'en', setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  // Keep the <html lang> attribute in sync for accessibility and SEO.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next) => {
    if (!SUPPORTED.includes(next)) return;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore write failures — language still applies for this session */
    }
    setLangState(next);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
