
import { ReactNode } from 'react';

export type Category = 'all' | 'ghee' | 'sweets' | 'honey' | 'superfoods';

export interface ProductVariant {
  s: string; // size
  p: number; // price
  on?: boolean;
}

export interface Product {
  id: string;
  name: string;
  vol: string;
  price: number;
  mrpPrice?: number;
  off?: string;
  rating: number;
  reviewCount: number;
  purityCoins: number; // For compatibility
  rewardCoins?: number; // Real admin defined reward
  productCoupon?: string; // Product-specific coupon
  soldCountLabel: string; // e.g., "1.5k+"
  statusBadge?: string; // e.g., "Selling Fast"
  cat: string;
  stock: number;
  badges: string[];
  pi: number; // placeholder index
  vars: ProductVariant[];
  description?: string;
  imageUrls?: string[];
}

export interface UniversalCoupon {
  id: string;
  code: string;
  type: 'flat' | 'percentage';
  value: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  purityCoins: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  qty: number;
}
