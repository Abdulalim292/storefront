'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { StorefrontChatLauncher } from '@/components/chat/StorefrontChatLauncher';
import { MobileContactBar } from '@/components/layout/MobileContactBar';
import { ProductImageProvider } from '@/context/ProductImageContext';

const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer').then((module) => module.CartDrawer), { ssr: false });

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasOpenedCart, setHasOpenedCart] = useState(false);

  return (
    <ProductImageProvider>
      <CartProvider>
        <Navbar onCartClick={() => {
          setHasOpenedCart(true);
          setIsCartOpen(true);
        }} />
        <div id="main" tabIndex={-1} className="flex-1 outline-none">{children}</div>
        {hasOpenedCart && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
        <StorefrontChatLauncher />
        <MobileContactBar />
      </CartProvider>
    </ProductImageProvider>
  );
}
