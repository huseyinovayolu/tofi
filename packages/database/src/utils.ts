import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

// Generate unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = nanoid(6).toUpperCase();
  return `TF-${timestamp}-${random}`;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Swiss postal code validation
export function isValidSwissPostalCode(code: string): boolean {
  return /^\d{4}$/.test(code);
}

// Swiss phone number validation
export function isValidSwissPhone(phone: string): boolean {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it starts with 41 (country code) and has the right length
  if (cleaned.startsWith('41')) {
    return cleaned.length >= 11 && cleaned.length <= 12;
  }
  
  // Check if it's a local number
  return cleaned.length >= 9 && cleaned.length <= 10;
}

// Format Swiss currency
export function formatChf(amount: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(amount);
}

// Calculate Swiss VAT
export function calculateVat(amount: number, vatRate: number = 7.7): {
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
} {
  const vatAmount = (amount * vatRate) / 100;
  return {
    netAmount: amount,
    vatAmount,
    grossAmount: amount + vatAmount,
  };
}

// Swiss cantons mapping
export const SWISS_CANTONS = {
  'AG': 'Aargau',
  'AI': 'Appenzell Innerrhoden',
  'AR': 'Appenzell Ausserrhoden',
  'BE': 'Bern',
  'BL': 'Basel-Landschaft',
  'BS': 'Basel-Stadt',
  'FR': 'Fribourg',
  'GE': 'Geneva',
  'GL': 'Glarus',
  'GR': 'Graubünden',
  'JU': 'Jura',
  'LU': 'Lucerne',
  'NE': 'Neuchâtel',
  'NW': 'Nidwalden',
  'OW': 'Obwalden',
  'SG': 'St. Gallen',
  'SH': 'Schaffhausen',
  'SO': 'Solothurn',
  'SZ': 'Schwyz',
  'TG': 'Thurgau',
  'TI': 'Ticino',
  'UR': 'Uri',
  'VD': 'Vaud',
  'VS': 'Valais',
  'ZG': 'Zug',
  'ZH': 'Zurich',
} as const;

export type SwissCantonCode = keyof typeof SWISS_CANTONS;