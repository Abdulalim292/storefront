'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { StorefrontChatLauncher } from '@/components/chat/StorefrontChatLauncher';

const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer').then((module) => module.CartDrawer), { ssr: false });

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasOpenedCart, setHasOpenedCart] = useState(false);

  return (
    <CartProvider>
      <Navbar onCartClick={() => {
        setHasOpenedCart(true);
        setIsCartOpen(true);
      }} />
      <div className="flex-1">{children}</div>
      {hasOpenedCart && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
      <StorefrontChatLauncher />
    </CartProvider>
  );
}
