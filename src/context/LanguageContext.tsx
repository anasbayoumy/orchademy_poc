'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

export type Language = 'en' | 'ar';

type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = { [key: string]: TranslationValue };

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    isRTL: boolean;
}

const translations: Record<Language, Translations> = {
    en: enTranslations,
    ar: arTranslations,
};

const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => { },
    t: (key: string) => key,
    isRTL: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('language') as Language | null;
        if (saved && (saved === 'en' || saved === 'ar')) {
            setLanguageState(saved);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
            document.documentElement.setAttribute('lang', language);
            localStorage.setItem('language', language);
        }
    }, [language, mounted]);

    const setLanguage = useCallback((newLang: Language) => {
        setLanguageState(newLang);
    }, []);

    const t = useCallback((key: string): string => {
        const keys = key.split('.');
        let value: TranslationValue = translations[language];

        for (const k of keys) {
            if (typeof value === 'object' && value !== null && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }

        return typeof value === 'string' ? value : key;
    }, [language]);

    const isRTL = language === 'ar';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
