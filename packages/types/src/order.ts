import type { BaseEntity, Address, ContactInfo, Price, OrderStatus, PaymentStatus, PaymentMethod } from './common';

export interface Order extends BaseEntity {
  orderNumber: string;
  userId: string;
  merchantId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: Price;
  deliveryFee: Price;
  taxes: Price;
  discount?: Price;
  total: Price;
  deliveryInfo: DeliveryInfo;
  paymentInfo: PaymentInfo;
  specialInstructions?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  rating?: number;
  review?: string;
  cancellationReason?: string;
  refundAmount?: Price;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: Price;
  totalPrice: Price;
  image?: string;
  specialRequests?: string;
  isGift: boolean;
  giftMessage?: string;
  customization?: OrderItemCustomization[];
}

export interface OrderItemCustomization {
  type: string; // e.g., 'ribbon_color', 'card_message', 'flower_color'
  name: string;
  value: string;
  additionalCost?: Price;
}

export interface DeliveryInfo {
  type: DeliveryType;
  address?: Address;
  contactInfo: ContactInfo;
  recipientName?: string;
  deliveryDate: Date;
  deliveryTimeSlot?: string;
  specialInstructions?: string;
  isGift: boolean;
  giftMessage?: string;
  signatureRequired: boolean;
  leaveAtDoor: boolean;
}

export type DeliveryType = 
  | 'standard' // Regular delivery
  | 'express' // Same-day or next-day
  | 'scheduled' // Specific date/time
  | 'pickup' // Customer pickup
  | 'subscription'; // Recurring delivery

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  invoiceNumber?: string;
  paidAt?: Date;
  failureReason?: string;
  refunds?: PaymentRefund[];
}

export interface PaymentRefund {
  id: string;
  amount: Price;
  reason: string;
  status: 'pending' | 'completed' | 'failed';
  processedAt?: Date;
  transactionId?: string;
}

export interface OrderTracking {
  orderId: string;
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  deliveryTracking?: DeliveryTracking;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy: string; // userId or 'system'
}

export interface DeliveryTracking {
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: Date;
  currentLocation?: string;
  events: DeliveryEvent[];
}

export interface DeliveryEvent {
  timestamp: Date;
  status: string;
  location?: string;
  description: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: Price;
  itemCount: number;
  expiresAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  merchantId: string;
  name: string;
  image?: string;
  quantity: number;
  unitPrice: Price;
  totalPrice: Price;
  isAvailable: boolean;
  maxQuantity?: number;
  customization?: OrderItemCustomization[];
  addedAt: Date;
}

export interface Checkout {
  cart: Cart;
  deliveryInfo: DeliveryInfo;
  paymentMethod: PaymentMethod;
  appliedCoupons?: string[];
  estimatedTotal: Price;
  availablePaymentMethods: PaymentMethod[];
  deliveryOptions: CheckoutDeliveryOption[];
}

export interface CheckoutDeliveryOption {
  type: DeliveryType;
  name: string;
  description: string;
  price: Price;
  estimatedTime: string;
  availableSlots?: TimeSlot[];
}

export interface TimeSlot {
  date: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  additionalCost?: Price;
}