"use client";

import { useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('vivaan_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('vivaan_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.vol === product.vol);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.vol === product.vol)
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const updateQty = (id: string, vol: string, delta: number) => {
    setCart(prev => 
      prev.map(item => 
        (item.id === id && item.vol === vol)
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeFromCart = (id: string, vol: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.vol === vol)));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  return { cart, addToCart, updateQty, removeFromCart, clearCart, subtotal, totalQty };
}
