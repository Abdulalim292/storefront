'use client';

import React, { useState } from 'react';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useCart } from '@/context/CartContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
        {/* Navbar needs to be able to trigger the CartDrawer. Since Navbar is inside RootLayout,
            we should wrap everything in a Layout component that provides the state,
            or move the cart state to a separate provider/context.
            For simplicity, we will move the CartDrawer trigger into a Context-driven state or use a simple hook.
            Actually, let's use a a separate "CartUIContext" to toggle the drawer from anywhere.
        */}
        <LayoutWrapper isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}>
          {children}
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </LayoutWrapper>
      </div>
    </CartProvider>
  );
}

function LayoutWrapper({ children, isCartOpen, setIsCartOpen }: { children: React.ReactNode, isCartOpen: boolean, setIsCartOpen: (val: boolean) => void }) {
  return (
    <>
      <NavbarWrapper setIsCartOpen={setIsCartOpen} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

function NavbarWrapper({ setIsCartOpen }: { setIsCartOpen: (val: boolean) => void }) {
  return (
    <NavbarWrapperInner setIsCartOpen={setIsCartOpen} />
  )
}

function NavbarWrapperInner({ setIsCartOpen }: { setIsCartOpen: (val: boolean) => void }) {
  // We will modify Navbar.tsx to accept the toggle function.
  return <div className="w-full">{/* This is a placeholder, the actual Navbar will be used inside layout.tsx */}</div>;
}
