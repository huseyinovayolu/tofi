import type { BaseEntity, Price } from './common';

export interface Product extends BaseEntity {
  merchantId: string;
  name: string;
  description: string;
  shortDescription?: string;
  sku?: string;
  category: ProductCategory;
  subcategory?: string;
  images: ProductImage[];
  price: Price;
  originalPrice?: Price; // For sales/discounts
  isAvailable: boolean;
  stockQuantity?: number;
  minQuantity: number;
  maxQuantity?: number;
  unit: ProductUnit;
  attributes: ProductAttribute[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  isPreOrderOnly: boolean;
  preOrderLeadTime?: number; // in hours
  seasonality?: ProductSeasonality;
  careInstructions?: string;
  flowerDetails?: FlowerDetails;
}

export type ProductCategory = 
  | 'bouquets'
  | 'arrangements'
  | 'plants'
  | 'wedding'
  | 'funeral'
  | 'corporate'
  | 'seasonal'
  | 'gifts'
  | 'accessories';

export type ProductUnit = 
  | 'piece'
  | 'bunch'
  | 'stem'
  | 'arrangement'
  | 'bouquet'
  | 'plant';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductAttribute {
  name: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'color' | 'size';
}

export interface ProductSeasonality {
  availableMonths: number[]; // 1-12
  peakMonths?: number[]; // when quality/availability is best
  notes?: string;
}

export interface FlowerDetails {
  flowerType: string[]; // e.g., ['Rose', 'Tulip', 'Lily']
  colors: string[]; // e.g., ['Red', 'Pink', 'White']
  fragrance?: 'none' | 'light' | 'medium' | 'strong';
  occasionSuitable: string[]; // e.g., ['Wedding', 'Birthday', 'Sympathy']
  lifespan?: string; // e.g., '5-7 days'
  careLevel: 'low' | 'medium' | 'high';
  symbolism?: string; // meaning of the flowers
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku?: string;
  price: Price;
  attributes: ProductAttribute[];
  stockQuantity?: number;
  isAvailable: boolean;
  images?: ProductImage[];
}

export interface ProductBundle {
  id: string;
  name: string;
  description: string;
  products: BundleProduct[];
  totalPrice: Price;
  discountAmount?: number;
  isAvailable: boolean;
  maxQuantity?: number;
}

export interface BundleProduct {
  productId: string;
  quantity: number;
  isOptional: boolean;
  substituteProductIds?: string[]; // alternative products
}

export interface ProductSearch {
  query?: string;
  category?: ProductCategory;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  colors?: string[];
  occasions?: string[];
  availability?: 'available' | 'preorder' | 'all';
  merchantId?: string;
  location?: {
    lat: number;
    lng: number;
    radius: number; // in km
  };
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number; // 1-5
  title?: string;
  comment?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
}