import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Swiss formatting utilities
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('de-CH').format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('de-CH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatPhoneNumber(phone: string): string {
  // Format Swiss phone numbers: +41 XX XXX XX XX
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('41')) {
    const number = cleaned.slice(2);
    return `+41 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5, 7)} ${number.slice(7)}`;
  }
  return phone;
}

export function formatPostalCode(code: string): string {
  // Swiss postal codes are 4 digits
  return code.padStart(4, '0');
}