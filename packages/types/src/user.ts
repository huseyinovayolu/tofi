import type { BaseEntity, ContactInfo, UserRole } from './common';
import type { SwissAddress, SwissLanguage } from './swiss';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  isMfaEnabled: boolean;
  language: SwissLanguage;
  lastLoginAt?: Date;
  addresses?: UserAddress[];
  preferences?: UserPreferences;
}

export interface UserAddress extends BaseEntity {
  userId: string;
  type: 'billing' | 'shipping';
  isDefault: boolean;
  label?: string; // e.g., 'Home', 'Office'
  contactInfo: ContactInfo;
  address: SwissAddress;
}

export interface UserPreferences {
  newsletter: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
  language: SwissLanguage;
  theme: 'light' | 'dark' | 'system';
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  device?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  language: SwissLanguage;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  newsletter?: boolean;
}

export interface UserLogin {
  email: string;
  password: string;
  rememberMe?: boolean;
  mfaCode?: string;
}

export interface PasswordReset {
  email: string;
  token: string;
  newPassword: string;
}

export interface MfaSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  language: SwissLanguage;
  addresses: UserAddress[];
  preferences: UserPreferences;
}