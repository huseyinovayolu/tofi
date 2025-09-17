import { z } from 'zod';

// Swiss-specific enums
export enum Canton {
  AARGAU = 'AG',
  APPENZELL_AUSSERRHODEN = 'AR',
  APPENZELL_INNERRHODEN = 'AI',
  BASEL_LANDSCHAFT = 'BL',
  BASEL_STADT = 'BS',
  BERN = 'BE',
  FRIBOURG = 'FR',
  GENEVA = 'GE',
  GLARUS = 'GL',
  GRISONS = 'GR',
  JURA = 'JU',
  LUCERNE = 'LU',
  NEUCHATEL = 'NE',
  NIDWALDEN = 'NW',
  OBWALDEN = 'OW',
  SCHAFFHAUSEN = 'SH',
  SCHWYZ = 'SZ',
  SOLOTHURN = 'SO',
  ST_GALLEN = 'SG',
  THURGAU = 'TG',
  TICINO = 'TI',
  URI = 'UR',
  VALAIS = 'VS',
  VAUD = 'VD',
  ZUG = 'ZG',
  ZURICH = 'ZH',
}

export enum Season {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  AUTUMN = 'AUTUMN',
  WINTER = 'WINTER',
  YEAR_ROUND = 'YEAR_ROUND',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  TWINT = 'TWINT',
  CREDIT_CARD = 'CREDIT_CARD',
  INVOICE = 'INVOICE',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// Zod schemas for validation
export const SwissPostalCodeSchema = z.string().regex(/^\d{4}$/, 'Swiss postal code must be 4 digits');
export const SwissPhoneSchema = z.string().regex(/^(\+41|0)[1-9]\d{1,8}$/, 'Invalid Swiss phone number');

// Product schemas
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  nameFr: z.string().optional(),
  description: z.string().min(1),
  descriptionFr: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.string(),
  stock: z.number().int().min(0),
  images: z.array(z.string().url()),
  season: z.nativeEnum(Season),
  region: z.nativeEnum(Canton),
  farmer: z.string().min(1),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  nameFr: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().min(1),
  image: z.string().url().optional(),
  parentId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Cart schemas
export const CartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  total: z.number().min(0),
  mwst: z.number().min(0),
  grandTotal: z.number().min(0),
});

// Order schemas
export const AddressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  company: z.string().optional(),
  street: z.string().min(1),
  houseNumber: z.string().min(1),
  postalCode: SwissPostalCodeSchema,
  city: z.string().min(1),
  canton: z.nativeEnum(Canton),
  phone: SwissPhoneSchema.optional(),
  email: z.string().email(),
});

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  customerId: z.string().optional(),
  status: z.nativeEnum(OrderStatus),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentStatus: z.nativeEnum(PaymentStatus),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  items: z.array(CartItemSchema),
  subtotal: z.number().min(0),
  mwst: z.number().min(0),
  shippingCost: z.number().min(0),
  total: z.number().min(0),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: SwissPhoneSchema.optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const MerchantSchema = z.object({
  id: z.string(),
  businessName: z.string().min(1),
  ownerName: z.string().min(1),
  email: z.string().email(),
  phone: SwissPhoneSchema,
  address: AddressSchema,
  vatNumber: z.string().optional(),
  bankAccount: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// TypeScript types
export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type User = z.infer<typeof UserSchema>;
export type Merchant = z.infer<typeof MerchantSchema>;

// Utility types
export interface ProductWithCategory extends Product {
  category: Category;
}

export interface OrderWithItems extends Order {
  items: (CartItem & { product: Product })[];
}

// Swiss-specific utilities
export const MWST_RATE = 0.077; // 7.7% Swiss VAT

export const formatCHF = (amount: number): string => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF'
  }).format(amount);
};

export const calculateMWST = (price: number): number => {
  return price * MWST_RATE;
};

export const calculatePriceWithMWST = (price: number): number => {
  return price + calculateMWST(price);
};

export const generateOrderNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CH${year}${month}${day}${random}`;
};

// Swiss cantons with their German and French names
export const CANTON_NAMES = {
  [Canton.AARGAU]: { de: 'Aargau', fr: 'Argovie' },
  [Canton.APPENZELL_AUSSERRHODEN]: { de: 'Appenzell Ausserrhoden', fr: 'Appenzell Rhodes-Extérieures' },
  [Canton.APPENZELL_INNERRHODEN]: { de: 'Appenzell Innerrhoden', fr: 'Appenzell Rhodes-Intérieures' },
  [Canton.BASEL_LANDSCHAFT]: { de: 'Basel-Landschaft', fr: 'Bâle-Campagne' },
  [Canton.BASEL_STADT]: { de: 'Basel-Stadt', fr: 'Bâle-Ville' },
  [Canton.BERN]: { de: 'Bern', fr: 'Berne' },
  [Canton.FRIBOURG]: { de: 'Freiburg', fr: 'Fribourg' },
  [Canton.GENEVA]: { de: 'Genf', fr: 'Genève' },
  [Canton.GLARUS]: { de: 'Glarus', fr: 'Glaris' },
  [Canton.GRISONS]: { de: 'Graubünden', fr: 'Grisons' },
  [Canton.JURA]: { de: 'Jura', fr: 'Jura' },
  [Canton.LUCERNE]: { de: 'Luzern', fr: 'Lucerne' },
  [Canton.NEUCHATEL]: { de: 'Neuenburg', fr: 'Neuchâtel' },
  [Canton.NIDWALDEN]: { de: 'Nidwalden', fr: 'Nidwald' },
  [Canton.OBWALDEN]: { de: 'Obwalden', fr: 'Obwald' },
  [Canton.SCHAFFHAUSEN]: { de: 'Schaffhausen', fr: 'Schaffhouse' },
  [Canton.SCHWYZ]: { de: 'Schwyz', fr: 'Schwyz' },
  [Canton.SOLOTHURN]: { de: 'Solothurn', fr: 'Soleure' },
  [Canton.ST_GALLEN]: { de: 'St. Gallen', fr: 'Saint-Gall' },
  [Canton.THURGAU]: { de: 'Thurgau', fr: 'Thurgovie' },
  [Canton.TICINO]: { de: 'Tessin', fr: 'Tessin' },
  [Canton.URI]: { de: 'Uri', fr: 'Uri' },
  [Canton.VALAIS]: { de: 'Wallis', fr: 'Valais' },
  [Canton.VAUD]: { de: 'Waadt', fr: 'Vaud' },
  [Canton.ZUG]: { de: 'Zug', fr: 'Zoug' },
  [Canton.ZURICH]: { de: 'Zürich', fr: 'Zurich' },
};