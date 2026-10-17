'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={cn(
        "fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <h2 className="text-lg font-bold text-slate-900">Your Shopping Bag</h2>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-slate-100 p-4">
                  <ShoppingBag className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">Your bag is empty</p>
                <Button variant="outline" onClick={onClose} className="mt-4">
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                      <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-semibold text-slate-800">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-200 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-slate-200 p-4 space-y-4">
              <div className="flex justify-between text-base font-bold text-slate-900">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <Button
                className="w-full gap-2"
                onClick={() => setIsContactModalOpen(true)}
              >
                <Mail className="h-4 w-4" />
                Contact for Order
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">Finalize Your Order</h3>
              <button onClick={() => setIsContactModalOpen(false)} className="p-1 text-slate-500 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-slate-600 mb-6">
              Our store is currently in catalog mode. Please send us an email with your cart items, and we'll get back to you with shipping and payment details.
            </p>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-slate-200 p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Button className="w-full" onClick={() => {
                alert('Thank you for your interest! We will contact you soon.');
                setIsContactModalOpen(false);
              }}>
                Send Inquiry
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ShoppingBag({ className, ...props }: any) {
  return <ShoppingBagIcon className={className} {...props} />
}

import { ShoppingBagIcon } from 'lucide-react';
