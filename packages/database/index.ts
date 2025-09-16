import { PrismaClient } from '@prisma/client';

declare global {
  // Prevent hot reload from creating new Prisma instances
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export * from '@prisma/client';
export { prisma as db };

// Utility functions for Swiss-specific data
export const swissUtils = {
  /**
   * Format Swiss price from centimes to CHF string
   */
  formatPrice: (centimes: number, includeVAT: boolean = true): string => {
    const chf = (centimes / 100).toFixed(2);
    const suffix = includeVAT ? ' (inkl. MwSt.)' : '';
    return `CHF ${chf}${suffix}`;
  },

  /**
   * Convert CHF to centimes
   */
  toCentimes: (chf: number): number => {
    return Math.round(chf * 100);
  },

  /**
   * Calculate Swiss VAT
   */
  calculateVAT: (centimes: number, rate: number = 0.077): number => {
    return Math.round(centimes * rate);
  },

  /**
   * Validate Swiss postal code
   */
  isValidPostalCode: (code: string): boolean => {
    return /^\d{4}$/.test(code);
  },

  /**
   * Format Swiss phone number
   */
  formatPhoneNumber: (number: string): string => {
    // Remove all non-digits
    const digits = number.replace(/\D/g, '');
    
    // Handle Swiss format
    if (digits.startsWith('41')) {
      const national = digits.substring(2);
      return `+41 ${national.substring(0, 2)} ${national.substring(2, 5)} ${national.substring(5, 7)} ${national.substring(7)}`;
    }
    
    // Handle national format
    if (digits.startsWith('0')) {
      const national = digits.substring(1);
      return `+41 ${national.substring(0, 2)} ${national.substring(2, 5)} ${national.substring(5, 7)} ${national.substring(7)}`;
    }
    
    return number;
  },

  /**
   * Get canton name in German
   */
  getCantonName: (canton: string): string => {
    const cantonNames: Record<string, string> = {
      'AG': 'Aargau',
      'AI': 'Appenzell Innerrhoden',
      'AR': 'Appenzell Ausserrhoden',
      'BE': 'Bern',
      'BL': 'Basel-Landschaft',
      'BS': 'Basel-Stadt',
      'FR': 'Freiburg',
      'GE': 'Genf',
      'GL': 'Glarus',
      'GR': 'Graubünden',
      'JU': 'Jura',
      'LU': 'Luzern',
      'NE': 'Neuenburg',
      'NW': 'Nidwalden',
      'OW': 'Obwalden',
      'SG': 'St. Gallen',
      'SH': 'Schaffhausen',
      'SO': 'Solothurn',
      'SZ': 'Schwyz',
      'TG': 'Thurgau',
      'TI': 'Tessin',
      'UR': 'Uri',
      'VD': 'Waadt',
      'VS': 'Wallis',
      'ZG': 'Zug',
      'ZH': 'Zürich',
    };
    return cantonNames[canton] || canton;
  }
};