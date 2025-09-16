// Swiss specific types
export interface SwissAddress {
  street: string;
  houseNumber: string;
  zipCode: string; // Swiss postal codes (4 digits)
  city: string;
  canton: SwissCanton;
  country: 'CH';
  latitude?: number;
  longitude?: number;
}

export type SwissCanton = 
  | 'AG' | 'AI' | 'AR' | 'BE' | 'BL' | 'BS' | 'FR' | 'GE' 
  | 'GL' | 'GR' | 'JU' | 'LU' | 'NE' | 'NW' | 'OW' | 'SG' 
  | 'SH' | 'SO' | 'SZ' | 'TG' | 'TI' | 'UR' | 'VD' | 'VS' | 'ZG' | 'ZH';

export interface SwissPhoneNumber {
  countryCode: '+41';
  number: string; // Format: 12 345 67 89
  formatted: string; // Format: +41 12 345 67 89
}

export interface SwissPrice {
  amount: number; // In centimes (Rappen)
  currency: 'CHF';
  formatted: string; // e.g., "CHF 12.50"
  vatIncluded: boolean;
  vatRate?: number; // e.g., 0.077 for 7.7%
}

// User and authentication types
export interface User {
  id: string;
  email: string;
  emailVerified?: Date | null;
  firstName: string;
  lastName: string;
  phone?: SwissPhoneNumber;
  address?: SwissAddress;
  preferredLanguage: 'de-CH' | 'fr-CH' | 'it-CH' | 'en';
  role: UserRole;
  isActive: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'CUSTOMER' | 'MERCHANT' | 'ADMIN' | 'SUPER_ADMIN';

// Authentication types
export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isValid: boolean;
}

export interface MFAConfig {
  enabled: boolean;
  method: 'TOTP' | 'SMS';
  backupCodes?: string[];
  lastUsed?: Date;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  images: ProductImage[];
  category: ProductCategory;
  price: SwissPrice;
  availability: ProductAvailability;
  merchantId: string;
  isActive: boolean;
  seasonalAvailability?: SeasonalAvailability;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  width?: number;
  height?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
}

export interface ProductAvailability {
  inStock: boolean;
  quantity?: number;
  nextAvailable?: Date;
  preOrderEnabled: boolean;
}

export interface SeasonalAvailability {
  startDate: Date;
  endDate: Date;
  recurring: boolean;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  merchantId: string;
  items: OrderItem[];
  total: SwissPrice;
  subtotal: SwissPrice;
  vat: SwissPrice;
  deliveryFee: SwissPrice;
  status: OrderStatus;
  deliveryAddress: SwissAddress;
  billingAddress?: SwissAddress;
  deliveryDate?: Date;
  deliveryTimeSlot?: TimeSlot;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: SwissPrice;
  totalPrice: SwissPrice;
  customization?: string;
}

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED' 
  | 'PREPARING'
  | 'READY_FOR_DELIVERY'
  | 'IN_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod = 
  | 'TWINT'
  | 'CREDIT_CARD'
  | 'BANK_TRANSFER'
  | 'CASH_ON_DELIVERY'
  | 'POSTFINANCE';

export interface TimeSlot {
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  date: Date;
}

// Merchant types
export interface Merchant {
  id: string;
  businessName: string;
  legalName?: string;
  email: string;
  phone: SwissPhoneNumber;
  address: SwissAddress;
  vatNumber?: string; // Swiss VAT number
  businessLicense?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  website?: string;
  socialMedia?: SocialMediaLinks;
  deliveryZones: DeliveryZone[];
  operatingHours: OperatingHours;
  minimumOrder?: SwissPrice;
  deliveryFee: SwissPrice;
  freeDeliveryThreshold?: SwissPrice;
  isActive: boolean;
  isVerified: boolean;
  rating?: number;
  totalReviews: number;
  joinedAt: Date;
  updatedAt: Date;
}

export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  website?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  postalCodes: string[];
  deliveryFee: SwissPrice;
  minimumOrder?: SwissPrice;
  deliveryTime: number; // in minutes
}

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string;  // HH:MM format
  closeTime?: string; // HH:MM format
  breaks?: TimeSlot[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

// Form types for Swiss specific inputs
export interface SwissAddressFormData {
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  canton: SwissCanton;
}

export interface SwissPhoneFormData {
  number: string;
}

// Localization types
export type SupportedLocale = 'de-CH' | 'fr-CH' | 'it-CH' | 'en';

export interface LocalizedContent {
  'de-CH': string;
  'fr-CH'?: string;
  'it-CH'?: string;
  'en'?: string;
}

// Search and filtering types
export interface SearchFilters {
  query?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  deliveryDate?: Date;
  inStockOnly?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'distance';
}

export interface SearchResults<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  filters: SearchFilters;
}