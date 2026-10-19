'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';
import { PRODUCTS } from '@/data/products';
import { EQUIPMENT_PRODUCTS } from '@/data/equipment';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'shopping-cart';
const MAX_ITEM_QUANTITY = 99;
const INQUIRY_PRODUCTS = [...PRODUCTS, ...EQUIPMENT_PRODUCTS];

function readCart(value: string | null): CartItem[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    const productsById = new Map(INQUIRY_PRODUCTS.map((product) => [product.id, product]));
    const quantities = new Map<string, number>();

    for (const item of parsed) {
      if (!item || typeof item !== 'object' || !('id' in item) || !('quantity' in item)) continue;
      const id = item.id;
      const quantity = item.quantity;
      if (typeof id !== 'string' || typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) continue;
      if (!productsById.has(id)) continue;
      quantities.set(id, Math.min(MAX_ITEM_QUANTITY, (quantities.get(id) ?? 0) + quantity));
    }

    return [...quantities].flatMap(([id, quantity]) => {
      const product = productsById.get(id);
      return product ? [{ ...product, quantity }] : [];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  useEffect(() => {
    try {
      setCart(readCart(window.localStorage.getItem(CART_STORAGE_KEY)));
    } catch {
      // Keep the in-memory cart available when browser storage is disabled.
    }
    setIsCartLoaded(true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY && event.key !== null) return;
      setCart(readCart(event.newValue));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (!isCartLoaded) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error: any) {
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.warn('Cart storage quota exceeded. Changes will not persist after page reload.');
      } else {
        console.error('Failed to save cart to local storage:', error);
      }
    }
  }, [cart, isCartLoaded]);

  const addToCart = (product: Product) => {
    const currentProduct = INQUIRY_PRODUCTS.find((item) => item.id === product.id);
    if (!currentProduct) return;

    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === currentProduct.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === currentProduct.id ? { ...item, quantity: Math.min(MAX_ITEM_QUANTITY, item.quantity + 1) } : item
        );
      }
      return [...prev, { ...currentProduct, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const nextQuantity = Math.floor(quantity);
    if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: Math.min(MAX_ITEM_QUANTITY, nextQuantity) } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
