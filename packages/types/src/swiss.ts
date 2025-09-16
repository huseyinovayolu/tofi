// Swiss-specific types and constants

export type SwissCanton = 
  | 'AG' | 'AI' | 'AR' | 'BE' | 'BL' | 'BS' | 'FR' | 'GE' | 'GL' 
  | 'GR' | 'JU' | 'LU' | 'NE' | 'NW' | 'OW' | 'SG' | 'SH' | 'SO' 
  | 'SZ' | 'TG' | 'TI' | 'UR' | 'VD' | 'VS' | 'ZG' | 'ZH';

export interface SwissAddress {
  street: string;
  streetNumber: string;
  postOfficeBox?: string;
  zipCode: string; // Swiss postal codes are 4 digits
  city: string;
  canton: SwissCanton;
  country: 'CH';
}

export interface SwissVatInfo {
  vatNumber?: string; // CHE-XXX.XXX.XXX MWST
  vatRate: number; // Standard rate: 7.7%
  isVatExempt: boolean;
}

export interface SwissPhoneNumber {
  countryCode: '+41';
  areaCode: string; // e.g., '44' for Zurich
  number: string;
  formatted: string; // e.g., '+41 44 123 45 67'
}

export interface SwissPaymentInfo {
  iban?: string; // Swiss IBAN format: CH93 0076 2011 6238 5295 7
  qrIban?: string; // QR-IBAN for QR-Bills
  bic?: string;
  bankName?: string;
  twintNumber?: string;
}

export interface SwissDeliveryZone {
  zipCodes: string[];
  canton: SwissCanton;
  deliveryFee: number;
  minimumOrderValue?: number;
  estimatedDeliveryTime: string; // e.g., '1-2 days'
}

// Swiss business types
export type SwissBusinessType = 
  | 'einzelfirma' // Sole proprietorship
  | 'kollektivgesellschaft' // General partnership
  | 'kommanditgesellschaft' // Limited partnership
  | 'gmbh' // Limited liability company
  | 'ag' // Stock corporation
  | 'genossenschaft' // Cooperative
  | 'verein'; // Association

export interface SwissBusinessInfo {
  businessType: SwissBusinessType;
  uid?: string; // Swiss business identification number
  commercialRegisterNumber?: string;
  vatNumber?: string;
}

// Swiss localization
export type SwissLanguage = 'de-CH' | 'fr-CH' | 'it-CH' | 'rm-CH';

export interface SwissLocalization {
  language: SwissLanguage;
  currency: 'CHF';
  dateFormat: 'dd.mm.yyyy';
  timeFormat: '24h';
  numberFormat: {
    decimal: '.';
    thousands: "'";
  };
}