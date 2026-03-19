import { ReactNode } from 'react';

export type Category = 'all' | 'ghee' | 'combo' | 'pickles' | 'sweets' | 'honey' | 'superfoods';

export interface ProductVariant {
  s: string; // size
  p: number; // price
  on?: boolean;
}

export interface Product {
  id: number;
  name: string;
  vol: string;
  price: number;
  mrp?: number;
  off?: string;
  rat: number;
  revs: string;
  coins: number;
  sold: string;
  cat: Category;
  stock: number;
  badges: string[];
  pi: number; // placeholder index for colors
  vars: ProductVariant[];
  description?: string;
}

export interface CartItem extends Product {
  qty: number;
}
