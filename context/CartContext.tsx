'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, EquipmentGroup, Product, ProductCategory } from '@/types';
import { PRODUCT_CATEGORY_VALUES } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  changeQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'shopping-cart';
const MAX_ITEM_QUANTITY = 99;
const MAX_TEXT_LENGTH = 2_000;
const CATEGORY_VALUES = new Set<string>(PRODUCT_CATEGORY_VALUES);
const EQUIPMENT_GROUP_VALUES = new Set<string>(['marine-engines', 'marine-gearboxes', 'heavy-machinery']);

function readString(value: unknown, maxLength = MAX_TEXT_LENGTH) {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

function safeImageUrl(value: unknown) {
  if (typeof value !== 'string' || value.length > 1_000) return null;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  return value.startsWith('https://') ? value : null;
}

function safeExternalUrl(value: unknown) {
  if (typeof value !== 'string' || value.length > 1_000) return '';
  return value.startsWith('https://') || value.startsWith('http://') ? value : '';
}

function sanitizeQuantity(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const quantity = Math.trunc(value);
  if (quantity < 1) return null;
  return Math.min(MAX_ITEM_QUANTITY, quantity);
}

// Stored carts are user-controlled (localStorage), so rebuild only known,
// bounded fields instead of trusting whatever JSON was saved.
function sanitizeProduct(value: unknown): Product | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  const id = readString(item.id, 200);
  const name = readString(item.name, 300);
  const category = readString(item.category, 50);
  if (!id || !name || !CATEGORY_VALUES.has(category)) return null;

  const images = Array.isArray(item.images)
    ? item.images.map(safeImageUrl).filter((image): image is string => Boolean(image)).slice(0, 5)
    : [];
  if (!images.length) return null;

  const price = typeof item.price === 'number' && Number.isFinite(item.price) && item.price >= 0
    ? item.price
    : null;
  const specifications = Array.isArray(item.specifications)
    ? item.specifications
      .filter((specification): specification is string => typeof specification === 'string')
      .map((specification) => specification.slice(0, 500))
      .slice(0, 30)
    : undefined;
  const equipmentGroup = readString(item.equipmentGroup, 40);

  return {
    id,
    name,
    description: readString(item.description),
    category: category as ProductCategory,
    images,
    imageSourceUrl: safeExternalUrl(item.imageSourceUrl),
    imageCredit: readString(item.imageCredit, 500),
    imageLicense: readString(item.imageLicense, 500),
    imageLicenseUrl: safeExternalUrl(item.imageLicenseUrl),
    price,
    specifications,
    equipmentGroup: EQUIPMENT_GROUP_VALUES.has(equipmentGroup) ? equipmentGroup as EquipmentGroup : undefined,
  };
}

function readCart(value: string | null): CartItem[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    const products = new Map<string, Product>();
    const quantities = new Map<string, number>();

    for (const entry of parsed) {
      if (!entry || typeof entry !== 'object' || !('quantity' in entry)) continue;
      const product = sanitizeProduct(entry);
      const quantity = sanitizeQuantity((entry as Record<string, unknown>).quantity);
      if (!product || !quantity) continue;

      products.set(product.id, product);
      quantities.set(product.id, Math.min(MAX_ITEM_QUANTITY, (quantities.get(product.id) ?? 0) + quantity));
    }

    return [...quantities].flatMap(([id, quantity]) => {
      const product = products.get(id);
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
    } catch (error) {
      const name = error instanceof Error ? error.name : '';
      if (name === 'QuotaExceededError' || name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.warn('Cart storage quota exceeded. Changes will not persist after page reload.');
      } else {
        console.error('Failed to save cart to local storage:', error);
      }
    }
  }, [cart, isCartLoaded]);

  const addToCart = (product: Product) => {
    const currentProduct = sanitizeProduct(product);
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

  const changeQuantity = (productId: string, delta: number) => {
    if (!Number.isFinite(delta) || delta === 0) return;
    const step = Math.trunc(delta);
    if (step === 0) return;

    setCart((prev) => prev.flatMap((item) => {
      if (item.id !== productId) return [item];
      const nextQuantity = Math.min(MAX_ITEM_QUANTITY, item.quantity + step);
      return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
    }));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, changeQuantity, clearCart, cartCount }}>
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
