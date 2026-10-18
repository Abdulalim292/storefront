'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MessageCircle } from 'lucide-react';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';

const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer').then((module) => module.CartDrawer), { ssr: false });
const StorefrontChatbot = dynamic(() => import('../chat/StorefrontChatbot').then((module) => module.StorefrontChatbot), { ssr: false });

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasOpenedCart, setHasOpenedCart] = useState(false);
  const [hasOpenedChat, setHasOpenedChat] = useState(false);

  return (
    <CartProvider>
      <Navbar onCartClick={() => {
        setHasOpenedCart(true);
        setIsCartOpen(true);
      }} />
      <main className="flex-1">{children}</main>
      {hasOpenedCart && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
      {hasOpenedChat ? (
        <StorefrontChatbot initiallyOpen />
      ) : (
        <button type="button" aria-label="Open support chat" onClick={() => setHasOpenedChat(true)} className="fixed bottom-4 right-4 z-[70] flex h-12 w-12 items-center justify-center gap-2 rounded-full bg-cyan-600 p-0 text-white shadow-lg shadow-cyan-900/25 transition hover:-translate-y-0.5 hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 sm:bottom-6 sm:right-6 sm:h-14 sm:w-auto sm:px-5">
          <MessageCircle className="h-5 w-5" />
          <span className="hidden text-sm font-semibold sm:inline">Chat with us</span>
        </button>
      )}
    </CartProvider>
  );
}
