'use client';

import { useState } from 'react';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { StorefrontChatbot } from '../chat/StorefrontChatbot';

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <StorefrontChatbot />
    </CartProvider>
  );
}
