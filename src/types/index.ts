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
  purityCoins: number;
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

export interface CartItem extends Product {
  qty: number;
}
