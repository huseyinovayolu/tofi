// Common types used across the platform

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Address {
  street: string;
  streetNumber: string;
  city: string;
  zipCode: string;
  canton: string;
  country: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  mobile?: string;
}

export interface Price {
  amount: number;
  currency: 'CHF';
  includesVat: boolean;
  vatRate?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type UserRole = 'customer' | 'merchant' | 'admin';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export type PaymentMethod = 
  | 'credit_card'
  | 'twint'
  | 'bank_transfer'
  | 'postfinance'
  | 'invoice';