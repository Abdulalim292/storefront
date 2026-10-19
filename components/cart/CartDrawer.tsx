import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ClipboardList, ShoppingBag, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ResilientImage } from '@/components/ui/ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [engineDetails, setEngineDetails] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isInquiryOpen) setIsInquiryOpen(false);
      else onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isInquiryOpen, onClose]);

  const inquiryText = [
    'Parts inquiry — Noor Alam Machineries',
    '',
    ...cart.map((item) => `${item.quantity} × ${item.name}`),
    '',
    `Engine name / model / serial: ${engineDetails || 'To be provided'}`,
  ].join('\n');

  const copyInquiry = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inquiryText);
      } else {
        // Fallback for non-secure contexts or unsupported browsers
        const textArea = document.createElement('textarea');
        textArea.value = inquiryText;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
          if (!successful) throw new Error('execCommand returned false');
        } finally {
          document.body.removeChild(textArea);
        }
      }
      setCopied(true);
      setCopyError(false);
    } catch (err) {
      console.error('Failed to copy inquiry:', err);
      setCopied(false);
      setCopyError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close inquiry list"
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div role="dialog" aria-modal="true" aria-labelledby="inquiry-drawer-title" className={cn(
        "fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <h2 id="inquiry-drawer-title" className="text-lg font-bold text-slate-900">Parts inquiry list</h2>
            <button ref={closeButtonRef} type="button" aria-label="Close inquiry list" onClick={onClose} className="grid h-11 w-11 place-items-center text-slate-500 hover:text-slate-900">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-slate-100 p-4">
                  <ShoppingBag className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">Your inquiry list is empty</p>
                <Button variant="outline" onClick={onClose} className="mt-4">
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                      <ResilientImage src={item.images[0]} alt={item.name} sizes="80px" className="object-contain p-1" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-black">{item.name}</h3>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name} from inquiry list`}
                          onClick={() => removeFromCart(item.id)}
                          className="grid h-10 w-10 shrink-0 place-items-center text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-200 rounded-md">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.name} quantity`}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="grid h-10 w-10 place-items-center hover:bg-slate-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase ${item.name} quantity`}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 99}
                            className="grid h-10 w-10 place-items-center hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-slate-200 p-4 space-y-4">
              <p className="text-sm text-slate-600">Pricing and availability are confirmed after part and engine fitment details are reviewed.</p>
              <Button
                className="w-full gap-2"
                onClick={() => { setIsInquiryOpen(true); setCopied(false); setCopyError(false); }}
              >
                <ClipboardList className="h-4 w-4" />
                Prepare parts inquiry
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {isInquiryOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="inquiry-modal-title" className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 id="inquiry-modal-title" className="text-xl font-bold text-slate-900">Prepare a parts inquiry</h3>
              <button type="button" aria-label="Close inquiry form" onClick={() => setIsInquiryOpen(false)} className="p-1 text-slate-500 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-slate-600 mb-6">
              Add the engine name, model or serial number, then copy the inquiry details to share with Noor Alam Machineries.
            </p>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="engine-details" className="text-xs font-semibold uppercase text-slate-500">Engine name, model or serial number</label>
                <input
                  id="engine-details"
                  type="text"
                  value={engineDetails}
                  onChange={(event) => setEngineDetails(event.target.value)}
                  placeholder="Enter engine name, model or serial number"
                  className="w-full rounded-md border border-slate-200 p-2 text-black caret-black outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <textarea
                aria-label="Parts inquiry details"
                readOnly
                value={inquiryText}
                className="h-36 w-full resize-none rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
              />
              <Button className="w-full gap-2" onClick={copyInquiry}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Inquiry copied' : 'Copy inquiry details'}
              </Button>
              {copyError && <p role="status" className="text-sm text-red-700">Copy was unavailable. Select and copy the inquiry text above.</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
