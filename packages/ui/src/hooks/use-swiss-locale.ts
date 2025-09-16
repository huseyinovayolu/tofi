import { useState, useEffect } from 'react';
import type { SwissLanguage } from '@tofi/types';

export interface UseSwissLocaleReturn {
  language: SwissLanguage;
  setLanguage: (lang: SwissLanguage) => void;
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  formatPhoneNumber: (phone: string) => string;
}

export function useSwissLocale(defaultLanguage: SwissLanguage = 'de-CH'): UseSwissLocaleReturn {
  const [language, setLanguage] = useState<SwissLanguage>(defaultLanguage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load language from localStorage or browser preference
    const saved = localStorage.getItem('tofi-language') as SwissLanguage;
    if (saved && ['de-CH', 'fr-CH', 'it-CH', 'rm-CH'].includes(saved)) {
      setLanguage(saved);
    } else {
      // Detect browser language
      const browserLang = navigator.language;
      if (browserLang.startsWith('de')) {
        setLanguage('de-CH');
      } else if (browserLang.startsWith('fr')) {
        setLanguage('fr-CH');
      } else if (browserLang.startsWith('it')) {
        setLanguage('it-CH');
      } else {
        setLanguage('de-CH'); // Default to German
      }
    }
    setIsLoading(false);
  }, []);

  const handleSetLanguage = (lang: SwissLanguage) => {
    setLanguage(lang);
    localStorage.setItem('tofi-language', lang);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: 'CHF',
    }).format(amount);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(language).format(date);
  };

  const formatPhoneNumber = (phone: string): string => {
    // Format Swiss phone numbers: +41 XX XXX XX XX
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('41')) {
      const number = cleaned.slice(2);
      return `+41 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5, 7)} ${number.slice(7)}`;
    }
    return phone;
  };

  return {
    language,
    setLanguage: handleSetLanguage,
    isLoading,
    formatCurrency,
    formatDate,
    formatPhoneNumber,
  };
}