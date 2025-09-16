import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Swiss-specific utility functions
export const swissUI = {
  /**
   * Format Swiss price for display
   */
  formatPrice: (centimes: number, showVAT: boolean = false): string => {
    const chf = (centimes / 100).toFixed(2);
    const vatText = showVAT ? ' (inkl. MwSt.)' : '';
    return `CHF ${chf}${vatText}`;
  },

  /**
   * Format Swiss phone number for display
   */
  formatPhone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('41')) {
      const national = cleaned.substring(2);
      return `+41 ${national.substring(0, 2)} ${national.substring(2, 5)} ${national.substring(5, 7)} ${national.substring(7)}`;
    }
    return phone;
  },

  /**
   * Validate Swiss postal code
   */
  validatePostalCode: (code: string): boolean => {
    return /^\d{4}$/.test(code);
  },

  /**
   * Get Swiss cantons for dropdown
   */
  getCantons: () => [
    { value: 'AG', label: 'Aargau (AG)' },
    { value: 'AI', label: 'Appenzell Innerrhoden (AI)' },
    { value: 'AR', label: 'Appenzell Ausserrhoden (AR)' },
    { value: 'BE', label: 'Bern (BE)' },
    { value: 'BL', label: 'Basel-Landschaft (BL)' },
    { value: 'BS', label: 'Basel-Stadt (BS)' },
    { value: 'FR', label: 'Freiburg (FR)' },
    { value: 'GE', label: 'Genf (GE)' },
    { value: 'GL', label: 'Glarus (GL)' },
    { value: 'GR', label: 'Graubünden (GR)' },
    { value: 'JU', label: 'Jura (JU)' },
    { value: 'LU', label: 'Luzern (LU)' },
    { value: 'NE', label: 'Neuenburg (NE)' },
    { value: 'NW', label: 'Nidwalden (NW)' },
    { value: 'OW', label: 'Obwalden (OW)' },
    { value: 'SG', label: 'St. Gallen (SG)' },
    { value: 'SH', label: 'Schaffhausen (SH)' },
    { value: 'SO', label: 'Solothurn (SO)' },
    { value: 'SZ', label: 'Schwyz (SZ)' },
    { value: 'TG', label: 'Thurgau (TG)' },
    { value: 'TI', label: 'Tessin (TI)' },
    { value: 'UR', label: 'Uri (UR)' },
    { value: 'VD', label: 'Waadt (VD)' },
    { value: 'VS', label: 'Wallis (VS)' },
    { value: 'ZG', label: 'Zug (ZG)' },
    { value: 'ZH', label: 'Zürich (ZH)' },
  ],
};