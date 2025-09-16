import type { BaseEntity, ContactInfo } from './common';
import type { SwissAddress, SwissBusinessInfo, SwissDeliveryZone, SwissVatInfo } from './swiss';

export interface Merchant extends BaseEntity {
  userId: string; // Reference to the user who owns this merchant account
  businessName: string;
  displayName: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  status: MerchantStatus;
  isVerified: boolean;
  businessInfo: SwissBusinessInfo;
  vatInfo: SwissVatInfo;
  contactInfo: ContactInfo;
  businessAddress: SwissAddress;
  deliveryZones: SwissDeliveryZone[];
  settings: MerchantSettings;
  stats?: MerchantStats;
}

export type MerchantStatus = 
  | 'pending' // Application submitted
  | 'under_review' // Being reviewed by admin
  | 'approved' // Approved and can sell
  | 'suspended' // Temporarily suspended
  | 'rejected' // Application rejected
  | 'inactive'; // Merchant chose to be inactive

export interface MerchantSettings {
  minOrderValue?: number;
  maxOrderValue?: number;
  processingTime: string; // e.g., '2-4 hours'
  autoAcceptOrders: boolean;
  requireOrderConfirmation: boolean;
  allowPreOrders: boolean;
  preOrderLeadTime?: number; // hours
  businessHours: BusinessHours[];
  specialDates?: SpecialDate[];
  paymentMethods: string[];
  deliveryMethods: string[];
}

export interface BusinessHours {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  openTime: string; // '09:00'
  closeTime: string; // '18:00'
  isClosed: boolean;
}

export interface SpecialDate {
  date: Date;
  type: 'closed' | 'holiday' | 'special_hours';
  openTime?: string;
  closeTime?: string;
  note?: string;
}

export interface MerchantStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  rating: number;
  reviewCount: number;
  responseTime: number; // average response time in minutes
  fulfillmentRate: number; // percentage of orders fulfilled on time
}

export interface MerchantApplication {
  businessName: string;
  displayName: string;
  description: string;
  businessInfo: SwissBusinessInfo;
  contactInfo: ContactInfo;
  businessAddress: SwissAddress;
  ownerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  documents: {
    businessRegistration?: string;
    vatCertificate?: string;
    identityDocument: string;
    businessLicense?: string;
  };
  agreedToTerms: boolean;
}

export interface MerchantReview {
  id: string;
  merchantId: string;
  userId: string;
  orderId: string;
  rating: number; // 1-5
  comment?: string;
  response?: {
    text: string;
    respondedAt: Date;
  };
  createdAt: Date;
  isVerified: boolean;
}